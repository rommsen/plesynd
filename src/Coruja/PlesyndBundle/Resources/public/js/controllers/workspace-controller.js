'use strict';

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, $filter, workspaceService, widgetService, workspace) {
    $scope.workspace = workspace;
    $scope.$parent.activeWorkspace = workspace;

    $scope.$watch('widgets', function() {
        // only show workspace widgets
        $scope.workspaceWidgets = $filter('filter')($scope.widgets, {workspace_id : $scope.workspace.id});
        if($scope.workspaceWidgets.length == 0) {
            $scope.show_edit = true;
        }
    }, true)

    $scope.selected_widget = null;

    $scope.deleteWorkspace = function () {
        workspaceService.delete($scope.workspace, function () {
            // Todo widgets are now own its own, delete them as well
            $scope.workspaces.splice($scope.workspaces.indexOf($scope.workspace), 1);
            $location.path('/dashboard');
        });
    };

    $scope.addWidgetToWorkspace = function() {
        $scope.widget.workspace_id = $scope.workspace.id;
        widgetService.post(widgetService.createEntity($scope.widget), function(widget) {
            // need to get it, because the widgets instance is not there yet
            widgetService.get({'widgetId': widget.id}, function(widget) {
                $scope.widgets.push(widget);
            })
        })
    };
});


