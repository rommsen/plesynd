'use strict';

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, $filter, workspaceService, widgetService, workspace) {
    $scope.workspace = workspace;

    // Todo not working when $scope.widgets changes during runtime
    $scope.$watch('widgets', function() {
        console.log('watch is called');
        $scope.workspaceWidgets = $filter('filter')($scope.widgets, {workspace_id : $scope.workspace.id});
    })

    $scope.selected_widget = null;

    $scope.deleteWorkspace = function () {
        workspaceService.delete($scope.workspace, function () {
            $scope.workspaces.splice($scope.workspaces.indexOf($scope.workspace), 1);
            $location.path('/dashboard');
        });
    }

    $scope.addWidgetToWorkspace = function() {
        $scope.widget.workspace_id = $scope.workspace.id;
        widgetService.post(widgetService.createEntity($scope.widget), function(widget) {
            // need to get it, because the widgets instance is not there yet
            widgetService.get({'widgetId': widget.id}, function(widget) {
                $scope.widgets.push(widget);
                $scope.workspaceWidgets.push(widget);
            })
        })
    }

    $scope.deleteWidgetFromWorkspace = function(widget) {
        widgetService.delete(widget, function() {
            $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
            $scope.workspaceWidgets.splice($scope.workspaceWidgets.indexOf(widget), 1);

        });
    }
});


