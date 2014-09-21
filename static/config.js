//configurate our project with shim to support build
requirejs.config({
  shim: {
    backbone: {
      deps: [
        'jquery',
        'underscore'
      ],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    'backbone-sync':{
      deps: [ 'backbone','underscore'],
      exports: 'Backbone'
    }
  },
  paths: {
    underscore: 'libs/underscore/underscore',
    jquery: 'libs/jquery/dist/jquery',
    backbone: 'libs/backbone/backbone',
    requirejs: 'libs/requirejs/require',
    i18next: 'libs/i18next/i18next',
    'backbone-sync': 'libs/backbone-sync/backbone-sync'
  }
});
requirejs(["app/app"]);
