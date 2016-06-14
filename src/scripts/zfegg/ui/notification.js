define(['jquery', 'kendo'], function($) {
    'use strict';

    var $view = $('<div data-width="300"></div>');
    $view.appendTo(document.body);
    return $view.kendoNotification().data('kendoNotification');
});