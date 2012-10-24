'use strict';

Application.Controllers.controller('DashboardCtrl', ['$scope', 'dashboard',
    function ($scope, dashboard) {
        $scope.dashboard = dashboard;
        $scope.$parent.activeWorkspace = null;
    }]);