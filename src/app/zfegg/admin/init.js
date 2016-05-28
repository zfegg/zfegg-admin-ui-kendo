define('zfegg/admin/init',
    [
        'zfegg/router'
    ], function (router) {
        'use strict';

        router.route('/zfegg/admin/:action', function (action) {
            require(['zfegg/admin/controller/' + action], function (view) {
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
            $tabs.dispatchController('zfegg/admin/controller/' + action);
        });
    });

