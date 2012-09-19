'use strict';

/* Controllers */
plesynd.controller('PlesyndCtrl', function ($rootScope, $scope, $http, $location, $filter, onlineStatus, workspaceService, widgetService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $scope.alertType = "";
        $scope.active = "progress-striped active progress-warning";
    });
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        $scope.alertType = "alert-success";
        $scope.active = "progress-success";
        $scope.newLocation = $location.path();
        console.log($scope.newLocation);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        alert("ROUTE CHANGE ERROR: " + rejection);
        $scope.alertType = "alert-error";
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

    $scope.show_edit = false;
    $scope.changeShowEdit = function() {
        $scope.show_edit = !$scope.show_edit;
    }

    $scope.online_status = onlineStatus.isOnline();
    $scope.online_status_string = onlineStatus.getOnlineStatusString();
    $scope.workspaces = workspaceService.query();
    $scope.widgets = widgetService.query();

    // get the widgets for the selectbox
    $scope.availableWidgets = [];
    $http.get('plesynd/api/widgets/available').success(function(widgets) {
        for(var id in widgets) {
            $scope.availableWidgets.push(widgets[id]);
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
            $location.path('/workspace/'+workspace.id);
        });
    }
});