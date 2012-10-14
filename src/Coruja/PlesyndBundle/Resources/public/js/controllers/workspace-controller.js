'use strict';

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, $filter, workspaceService, widgetService, workspace, systemMessageService) {
    $scope.workspace = workspace;
    $scope.widgetTitleFilter = '';
    $scope.offlineCompatibleFilter = false;
    $scope.$parent.activeWorkspace = workspace;

    $scope.$watch('widgets', function () {
        // only show workspace widgets
        $scope.workspaceWidgets = $filter('filter')($scope.widgets, {workspace_id:$scope.workspace.id});
        if ($scope.workspaceWidgets.length == 0) {
            $scope.changeShowEdit(true);
        }
    }, true);

    $scope.selected_widget = null;

    $scope.deleteWorkspace = function () {
        workspaceService.delete($scope.workspace, function () {
            // need to reload, because there is no direct binding
            $scope.$parent.workspaces = workspaceService.query();
            systemMessageService.addSuccessMessage('Workspace ' + $scope.workspace.title + ' deleted');
            $location.path('/dashboard');
        });
    };

    $scope.updateTitle = function () {
        workspaceService.put($scope.workspace,
            function () {
                // need to reload, because there is no direct binding
                $scope.$parent.workspaces = workspaceService.query();
                $scope.change_title = false;
                systemMessageService.addSuccessMessage('Workspace ' + $scope.workspace.title + ' updated');
            },
            function () {
                systemMessageService.addErrorMessage('Workspace ' + $scope.workspace.title + ' could not be updated');
            });
    }

    $scope.addWidgetToWorkspace = function () {
        $scope.widget.workspace_id = $scope.workspace.id;
        widgetService.post(widgetService.createEntity($scope.widget), function (widget) {
            // need to get it, because the widgets instance is not there yet
            widgetService.get({'widgetId':widget.id}, function (widget) {
                $scope.widgets.push(widget);
                systemMessageService.addSuccessMessage('Widget ' + widget.title + ' was added');
            })
        })
    };

    $scope.offlineCompatibleCheck = function(widget) {
        if($scope.offlineCompatibleFilter) {
            return widget.is_offline_compatible
        }
        return true;
    }
});


