'use strict';

/**
 * Plesynd Controllers
 *
 * @module Plesynd.Controllers
 */

/**
 * Handles the Dashboard
 *
 * @class DashboardCtrl
 */
Application.Controllers.controller('DashboardCtrl', ['$scope', 'dashboard',
    /**
     * @method Factory
     * @param $scope
     * @param dashboard
     */
    function ($scope, dashboard) {
        $scope.dashboard = dashboard;
        $scope.$parent.activeWorkspace = null;
    }]);