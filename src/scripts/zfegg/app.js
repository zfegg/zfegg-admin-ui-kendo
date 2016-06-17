define([
    'require',
    'kendo',
    'jquery',
    './ui/view/layout',
    './router',
    './model/oauth',
    './ui/init',
], function (require, kendo, $, LayoutView, router, Oauth, UiInit) {
   var Application = kendo.Observable.extend({
       layout: null,
       modules: ['zfegg/ui/init'],
       options: {
           baseUrl: './data',
           menusDataSource: [],
           renderElement: document.body,
           oauth: {
               path: '',
               clientId : '',
               clientSecret: '',
               cookiePrefix: ''
           }
       },
       init: function (options) {
           var self = this;

           kendo.Observable.fn.init.call(this);
           this.options = $.extend(this.options, options);
           this.router = router;
           this.bind('route', function () {
              self.router.start();
           });

           var oauthOptions = this.options.oauth;
           this.oauth = new Oauth(this.options.baseUrl + oauthOptions.path, oauthOptions.clientId, oauthOptions.clientSecret, oauthOptions.cookiePrefix);
       },
       addModules: function (modules) {
           this.modules = this.modules.concat(modules);
       },
       initLayout: function () {
           if (this.layout) {
               return this.layout;
           }

           this.layout = new LayoutView({
               model: {
                   menus: this.options.menusDataSource
               }
           });

           this.layout.render(this.options.renderElement);
       },
       run: function () {
           var self = this,
               loaded = [];

           $.each(self.modules, function (i, module) {
               require([module], function (call) {
                   call && call(self);

                   loaded.push(module);
                   if (loaded.length == self.modules.length) {
                       self.trigger('route');
                   }
               });
           });
       }
   });

   return Application;
});
