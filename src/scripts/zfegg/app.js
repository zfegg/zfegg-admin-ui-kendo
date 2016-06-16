define(['require', 'kendo', 'jquery', './ui/view/layout', './router', './ui/init'], function (require, kendo, $, LayoutView, router) {
   var Application = kendo.Observable.extend({
       layout: null,
       modules: ['zfegg/ui/init'],
       options: {
           menusDataSource: [],
           renderElement: document.body
       },
       init: function (options) {
           var self = this;

           kendo.Observable.fn.init.call(this);
           this.options = $.extend(this.options, options);
           this.router = router;
           this.bind('route', function () {
              self.router.start();
           });
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
