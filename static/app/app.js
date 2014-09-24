define([
    "backbone",
    "jquery",
    "underscore",
    "backbone-sync"
],function(){
	var TestNum = 1;
    // Create a websocket connection
    var conn = new WebSocket("ws://localhost:8080");

    var IModel = Backbone.Model.extend({
        connection: conn,
		defaults:{
			name : "John",
			age  : "32",
			lang : "nl"
		}
    });

    var IView = Backbone.View.extend({
        el:$(".items"),
        template: _.template($("#item-template").html()),
        events:{
          "click .update" : "update",
          "click .reset"  : "resetItem",
          "click .reload" : "reload"
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        resetItem: function(){
            this.model.set("age",22);
        },
        update: function () {
            this.model.set("age",parseInt(this.model.get("age"))+1);
            this.model.save();
        },
        reload:function(){
            this.model.fetch();
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

    //get items model/view
    model = new IModel();
    view = new IView({
        model:model
    });
		
    var IWorkspace = Backbone.Router.extend({
        routes:{

        },
        initialize: function(){
            console.log("app > loaded");
		    this.render();
        },
        render: function(){
            model.fetch();
            view.render();
            return this;
        }
    });

    // fire the app
    $(document).ready(function(){
        new IWorkspace;
        Backbone.history.start({pushState:true});
    });
});
