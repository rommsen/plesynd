'use strict';

Application.Services.factory('confirmationService', ["$rootScope",
    function ($rootScope) {
        var noop = angular.noop,
            service = {},
            confirm_text,
            confirm_callback,
            cancel_callback;

        service.confirmation_needed = false;

        service.confirm = function(text, confirm, cancel) {
            confirm_text = text;
            confirm_callback = confirm;
            cancel_callback = cancel;
            service.confirmation_needed = true;
        };

        service.confirmed = function() {
            (confirm_callback || noop)();
            service.reset();
        };

        service.cancelled = function() {
            (cancel_callback || noop)();
            service.reset();
        };

        service.reset = function() {
            confirm_text = null;
            confirm_callback = null;
            cancel_callback = null;
            service.confirmation_needed = false;
        };

        service.getConfirmationText = function() {
            return confirm_text;
        };

        return service;
    }]);