'use strict';

/* Controllers */
plesynd.controller('PlesyndCtrl', function ($scope, $http, $route, $routeParams, $filter, onlineStatus, workspaceService) {
    function getWorkspaces() {
        return workspaceService.query();
    }

    $scope.online_status = onlineStatus.isOnline();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();
    $scope.workspaces = getWorkspaces();

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

    $scope.addWorkspace = function() {
        var number = $scope.workspaces.length+1;
        var workspace = workspaceService.createEntity({
            'title' : 'Workspace '+ number,
            'slug' : 'workspace_'+ number
        });
        workspaceService.post(workspace, function () {
            $scope.workspaces.push(workspace);
        });
    }
});

plesynd.controller('DashboardCtrl', function ($scope) {

});

plesynd.controller('WorkspaceCtrl', function ($scope) {
    $scope.parent = $scope.$parent;
    $scope.$watch('parent.activeWorkspace', function (activeWorkspace) {
        $scope.workspace = activeWorkspace;
    });
});

