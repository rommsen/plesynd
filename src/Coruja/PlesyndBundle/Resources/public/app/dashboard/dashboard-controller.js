'use strict';

Application.Controllers.controller('DashboardCtrl', function ($scope, dashboard) {
    $scope.dashboard = dashboard;
    $scope.$parent.activeWorkspace = null;
});