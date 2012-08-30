'use strict';

/* Controllers */
plesynd.controller('PlesyndCtrl', function ($scope, $http, $route, $routeParams, onlineStatus, $filter) {
    $scope.online_status = onlineStatus.isOnline();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();

    $http.get('workspaces').success(function (workspaces) {
        $scope.workspaces = workspaces;
    });

    $scope.routeParams = $routeParams;
    $scope.$watch('routeParams.slug', function (slug) {
        $scope.active_slug = slug;
        // active_slug is undefined in the first call
        if ($scope.active_slug !== undefined) {
            var filtered = $filter('filter')($scope.workspaces, {slug:$scope.active_slug});
            $scope.activeWorkspace = filtered && filtered.length > 0 ? filtered[0] : null;
        }
    });

    $scope.$on('onlineChanged', function (evt, isOnline) {
        $scope.online_status = isOnline;
        $scope.online_status_string = onlineStatus.getOnlineStatusString();
        $scope.$apply();
    });
});

plesynd.controller('DashboardCtrl', function ($scope) {

});

plesynd.controller('WorkspaceCtrl', function ($scope) {
    $scope.parent = $scope.$parent;
    $scope.$watch('parent.activeWorkspace', function (activeWorkspace) {
        $scope.workspace = activeWorkspace;
    });
});


