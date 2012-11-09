'use strict';

Application.Directives.directive('messageContainer', [
    function () {
        var template = '<div class="alert" ></div>';
        return {
            'restrict' : 'AE',
            'link' : function (scope, element, attrs, ctrl) {
                scope.$on('systemMessageAdded', function (event, message) {
                    if (message.message !== undefined) {
                        var msg = angular.element(template);
                        msg.html(message.message);
                        if (message.type !== undefined) {
                            msg.addClass('alert-' + message.type);
                        }

                        if (!message.sticky) {
                            msg.delay(5000).slideUp('slow', function () {
                                msg.remove();
                            });
                        }

                        msg.appendTo(element);
                    }
                });
            }
        };
    }]);
