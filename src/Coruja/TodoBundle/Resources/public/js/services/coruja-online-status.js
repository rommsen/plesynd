
angular.module('corujaOnlineStatus', []).factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $rootScope.$on('onlineChanged', function(evt, isOnline) {
        onlineStatus.onLine = isOnline;
    });

    return onlineStatus;
}]);