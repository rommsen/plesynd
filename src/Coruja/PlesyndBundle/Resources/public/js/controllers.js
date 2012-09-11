'use strict';

/* Controllers */
plesynd.controller('PlesyndCtrl', function ($scope, $http, $route, $routeParams, $location, $filter, onlineStatus, workspaceService) {
    function getWorkspaces() {
        return workspaceService.query();
    }

    $scope.show_edit = false;

    $scope.changeShowEdit = function() {
        $scope.show_edit = !$scope.show_edit;
    }


    $scope.online_status = onlineStatus.isOnline();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();
    $scope.workspaces = getWorkspaces();

    $scope.routeParams = $routeParams;
    $scope.$watch('routeParams.slug', function (slug) {
        $scope.active_slug = slug;
        $scope.show_edit = false;
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

    $scope.addWorkspace = function () {
        var number = $scope.workspaces.length + 1;
        var workspace = workspaceService.createEntity({
            'title':'Workspace ' + number,
            'slug':'workspace_' + number,
            'widgets': []
        });
        workspaceService.post(workspace, function () {
            $scope.workspaces.push(workspace);
            console.log('jump to; /workspace/'+workspace.slug);
            $location.path('/workspace/'+workspace.slug);
        });
    }
});

plesynd.controller('DashboardCtrl', function ($scope) {

});

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, workspaceService) {
    $scope.parent = $scope.$parent;

    $scope.selected_widget = null;
    $scope.widgets = [];
    $http.get('plesynd/api/widgets').success(function(widgets) {
        for(var id in widgets) {
            $scope.widgets.push(widgets[id]);
        }
    });

    $scope.$watch('parent.activeWorkspace', function (activeWorkspace) {
        $scope.workspace = activeWorkspace;
    });

//    $scope.$watch('parent.show_edit', function (show_edit) {
//        console.log('changed');
//        $scope.show_edit = show_edit;
//    });

    $scope.deleteWorkspace = function () {
        workspaceService.delete($scope.workspace, function () {
            $scope.parent.workspaces.splice($scope.parent.workspaces.indexOf($scope.workspace), 1);
            $location.path('/dashboard');

        });
    }

    $scope.addWidgetToWorkspace = function() {
        $http.post('plesynd/api/workspaces/'+$scope.workspace.slug+"/widgets", $scope.widget).success(function(data, code, headers) {
            $http.get(headers('Location')).success(function(widget) {
                $scope.workspace.widgets.push(widget);
            });
        });
    }


});


