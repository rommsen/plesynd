'use strict';

Application.Services.factory('systemMessageService', ["$rootScope", "$timeout", function ($rootScope, $timeout) {
    function MessageService() {
    }

    MessageService.prototype.addMessageObject = function (message) {
        $timeout(function () {
            $rootScope.$broadcast("systemMessageAdded", message);
        })
    };

    MessageService.prototype.addMessage = function (message, sticky) {
        this.addMessageObject({
            'message':message,
            'sticky':sticky || false
        });
    };

    MessageService.prototype.addInfoMessage = function (message, sticky) {
        this.addMessageObject({
            'message':message,
            'type':'info',
            'sticky':sticky || false
        });
    };

    MessageService.prototype.addErrorMessage = function (message, sticky) {
        this.addMessageObject({
            'message':message,
            'type':'error',
            'sticky':sticky || false
        });
    };

    MessageService.prototype.addSuccessMessage = function (message, sticky) {
        this.addMessageObject({
            'message':message,
            'type':'success',
            'sticky':sticky || false
        });
    };

    return new MessageService();
}]);