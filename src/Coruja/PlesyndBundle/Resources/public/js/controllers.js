'use strict';

/* Controllers */
plesynd.controller('PlesyndCtrl', function ($rootScope, $scope, $http, $location, $filter, onlineStatus, workspaceService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $scope.alertType = "";
        $scope.alertMessage = "Loading...";
        $scope.active = "progress-striped active progress-warning";
    });
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        $scope.alertType = "alert-success";
        $scope.alertMessage = "Successfully changed routes :)";
        $scope.active = "progress-success";
        $scope.newLocation = $location.path();
        console.log($scope.newLocation);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        alert("ROUTE CHANGE ERROR: " + rejection);
        $scope.alertType = "alert-error";
        $scope.alertMessage = "Failed to change routes :(";
        $scope.active = "";
    });

    $rootScope.$on('onlineChanged', function (evt, isOnline) {
        $scope.online_status = isOnline;
        $scope.online_status_string = onlineStatus.getOnlineStatusString();
        $scope.$apply();
    });

    $scope.checkActiveTab = function (url) {
        url = url == 'dashboard' ? '/dashboard' : '/workspace/'+url;
        return url == $scope.newLocation;

    };

    $scope.alertType = "alert-info";
    $scope.alertMessage = "Welcome to the resolve demo";

    $scope.show_edit = false;
    $scope.changeShowEdit = function() {
        $scope.show_edit = !$scope.show_edit;
    }

    $scope.online_status = onlineStatus.isOnline();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();
    $scope.workspaces = workspaceService.query();

    // get the widgets for the selectbox
    $scope.widgets = [];
    $http.get('plesynd/api/widgets').success(function(widgets) {
        for(var id in widgets) {
            $scope.widgets.push(widgets[id]);
        }
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
            $location.path('/workspace/'+workspace.slug);
        });
    }
});

plesynd.controller('DashboardCtrl', function ($scope) {

});

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, workspaceService, workspace) {
    $scope.workspace = workspace;
    $scope.selected_widget = null;

    $scope.deleteWorkspace = function () {
        workspaceService.delete($scope.workspace, function () {
            $scope.workspaces.splice($scope.workspaces.indexOf($scope.workspace), 1);
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


