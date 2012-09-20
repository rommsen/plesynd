'use strict';

plesynd.controller('WorkspaceCtrl', function ($scope, $http, $location, $filter, workspaceService, widgetService, workspace) {
    $scope.workspace = workspace;

    $scope.$watch('widgets', function() {
        // only show workspace widgets
        $scope.workspaceWidgets = $filter('filter')($scope.widgets, {workspace_id : $scope.workspace.id});
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
//                $scope.workspaceWidgets.push(widget);
            })
        })
    };

    $scope.deleteWidgetFromWorkspace = function(widget) {
        widgetService.delete(widget, function() {
            $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
        });
    };

    $scope.renderWidgetIframe = function(widget) {
        return '<iframe src="'+ widget.instance.url +'" name="' + widget.instance_identifier + '" width='+ widget.instance.width +' height='+ widget.instance.height +'></iframe>';
    };
});


