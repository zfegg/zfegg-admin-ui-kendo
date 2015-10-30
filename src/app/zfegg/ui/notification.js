define('zfegg/ui/notification', ['jquery', 'kendo'], function($) {
    'use strict';

    return $('#notification').kendoNotification().data('kendoNotification');
});