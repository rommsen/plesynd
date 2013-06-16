'use strict';

/**
 * Plesynd Controllers
 *
 * @module Plesynd.Controllers
 */

/**
 * Main controller for the application
 *
 * @class PlesyndCtrl
 */
Application.Controllers.controller('PlesyndCtrl', ['$timeout', '$rootScope', '$scope', '$http', '$location', 'onlineStatus', 'workspaceService', 'widgetService', 'childFrameService', 'systemMessageService',  'confirmationService',
    /**
     * @method Factory
     * @param {Object} $timeout
     * @param {Object} $rootScope
     * @param {Object} $scope
     * @param {Object} $http
     * @param {Object} $location
     * @param {Object} onlineStatus
     * @param {Object} workspaceService
     * @param {Object} widgetService
     * @param {Object} childFrameService
     * @param {Object} systemMessageService
     * @param {Object} confirmationService
     */
    function ($timeout, $rootScope, $scope, $http, $location, onlineStatus, workspaceService, widgetService, childFrameService, systemMessageService,  confirmationService) {

        $scope.rerender_content = false;

        /**
         * @method $routeChangeStart Event-Listener
         */
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $scope.loading = true;
            $scope.changeShowEdit(false);
        });

        /**
         * @method $routeChangeSuccess Event-Listener
         */
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            $scope.loading = false;
            $scope.newLocation = $location.path();
        });

        /**
         * @method $routeChangeError Event-Listener
         */
        $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
            $scope.loading = false;
        });

        /**
         * Called when the online status of plesynd has changed
         * @method onlineChanged Event-Listener
         */
        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            $scope.isOnline = isOnline;
            $scope.online_status_string = onlineStatus.getOnlineStatusString();
            if (!isOnline) {
                $scope.changeShowEdit(false);
            } else {
                $scope.getAvailableWidgets();
                $scope.rerender_content = true;
            }
        });

        /**
         * @method event:auth-loginConfirmed Event-Listener
         */
        $rootScope.$on('event:auth-loginConfirmed', function () {
            if($scope.rerender_content) {
                $scope.initializeContent();
            }
            $scope.rerender_content = false;
        });

        /**
         * @method event:auth-loginRequired Event-Listener
         */
        $rootScope.$on('event:auth-loginRequired', function () {
            $location.path('/dashboard');
        });

        /**
         * Checks whether to activate a tab or not
         * @method checkActiveTab
         * @param {String} url
         */
        $scope.checkActiveTab = function (url) {
            url = url === 'dashboard' ? '/dashboard' : '/workspace/' + url;
            return url === $scope.newLocation;
        };

        /**
        * Show the edit function or not
        * @method changeShowEdit
        * @param {Boolean} show_edit
        */
        $scope.changeShowEdit = function (show_edit) {
            // always false offline
            if (!$scope.isOnline) {
                $scope.show_edit = false;
            } else {
                $scope.show_edit = show_edit;
            }
        };

        /**
         * Initializes workspaces, widgets etc.
         * @method initializeContent
         */
        $scope.initializeContent = function () {
            $scope.workspaces = [];
            $scope.widgets = [];
            $timeout(function() {

            $scope.workspaces = workspaceService.query();
            $scope.widgets = widgetService.query(function (widgets) {
                childFrameService.setWidgets(widgets);
            });
            }, 20);
            $scope.getAvailableWidgets();
        };

        /**
         * @method getAvailableWidgets
         */
        $scope.getAvailableWidgets = function() {
            // get the widgets for the selectbox
            $scope.availableWidgets = [];
            if($scope.isOnline) {
                var id;
                $http.get('plesynd/api/widgets/available').success(function (widgets) {
                    for (id in widgets) {
                        $scope.availableWidgets.push(widgets[id]);
                    }
                });
            }
        }

        $scope.isOnline = onlineStatus.isOnline();
        $scope.online_status_string = onlineStatus.getOnlineStatusString();
        $scope.initializeContent();

        /**
         * Adds a workspace to the system
         * @method addWorkspace
         */
        $scope.addWorkspace = function () {
            var workspace = workspaceService.createEntity({
                'title'   : 'untitled ',
                'widgets' : []
            });
            workspaceService.post(workspace, function () {
                $scope.workspaces.push(workspace);
                $location.path('/workspace/' + workspace.id);
                systemMessageService.addSuccessMessage('Workspace added');
            });
        };

        /**
         * @method isWidgetVisible
         * @param {Object} widget
         * @returns {boolean}
         */
        $scope.isWidgetVisible = function (widget) {
            // needs a couple of digest cycles to be defined and set
            if ($scope.activeWorkspace === null || $scope.activeWorkspace === undefined) {
                return false;
            }

            return widget.workspace.id === $scope.activeWorkspace.id;
        };

        /**
         * @method deleteWidget
         * @param {Object} widget
         */
        $scope.deleteWidget = function (widget) {
            confirmationService.confirm('Do you really want to delete this widget?', function () {
                widgetService['delete'](widget, function () {
                    $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
                    systemMessageService.addSuccessMessage('Widget ' + widget.title + ' deleted');
                });
            });
        };
    }]);
