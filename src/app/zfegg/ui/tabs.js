define('zfegg/ui/tabs', ['jquery', 'kendo'], function($) {
    'use strict';

    var $tabs = $();

    var defaultTitle = document.title;


    var _isInited = false, init = function ($tabs) {
        if (_isInited) {
            return ;
        }
        _isInited = true;
        $tabs.data('kendoTabStrip').bind('select', function (e) {
            if ($(e.item).data('location')) {
                window.location.hash = $(e.item).data('location');
            }
        });
    };

    $tabs.dispatchController = function (ctrl) {
        var kTabStrip = this.data('kendoTabStrip');
        var routers = this.data('routers') || {};
        init(this);

        if (routers[window.location.hash]) {
            kTabStrip.activateTab(routers[window.location.hash].tab);
            document.title = routers[window.location.hash].view.title + ' - ' + defaultTitle;
        } else {
            require([ctrl], function (view) {
                if (typeof(view.render) == 'function') {
                    view.render(function ($container) {

                        kTabStrip.append([{
                            text: view.title,
                            content: ''
                        }]).activateTab('li:last');

                        var li = kTabStrip.items()[kTabStrip.items().length-1];
                        var $tabContent = $(kTabStrip.contentElement(kTabStrip.items().length-1));
                        $tabContent.empty();
                        $tabContent.append($container);

                        routers[window.location.hash] = {tab: li, view: view};

                        $(li).data('location', window.location.hash);
                        $tabs.data('routers', routers);

                        document.title = routers[window.location.hash].view.title + ' - ' + defaultTitle;
                    });
                }
            });
        }

        return this;
    };

    return $tabs;
});