/**
 * Copyright (c) Dmitry Poddubniy. All Rights Reserved.
 *
 * Overrides the default transport for Backbone syncing to use websockets via standart websocket api
 */
 console.log("backbone-sync > loaded");

(function(Backbone, $, _){

    Backbone.ajaxSync = function(method, model, options){
        return ajaxSync.call(this, method, model, options);
    };

    /**
     * Replace the standard sync function with our new, websocket based solution.
     */
    // Overwrite Backbone.sync method
    Backbone.sync = function(method, model, options){
        var defer = $.Deferred(),
            promise = defer.promise();
      // create a connection to the server
      var ws = model.socket || model.connection;
      options.sended = false;
      // send the command in url only if the connection is opened
      // command attribute is used in server-side.
      // check that connection alive
      ws.onopen = function(){
        // in my convention, every message sent to the server must be:
        // {"command":"action", "data":"data sent to the server"}
        ws.send(JSON.stringify({"command":method, data:model.attributes}));
          options.sended = true;
      };
      // alive ?
      if (ws.readyState==1) ws.send(JSON.stringify({"command":method, data:model.attributes}));
           
      ws.onmessage = function(message){
        // message.data is a property sent by the server
        // change it to suit your needs
        var _return = JSON.parse(message.data);
        // executes the success callback when receive a message from the server
        defer.resolve(_return);
        options.success(_return);
        return;
      };
      model.trigger('request', model, promise, options);
      return promise;
    };
})(Backbone, jQuery, _);
