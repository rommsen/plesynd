'use strict';

/* Controllers */
Application.Controllers.controller('PlesyndCtrl', ['$timeout', '$rootScope', '$scope', '$http', '$location', 'onlineStatus', 'workspaceService', 'widgetService', 'childFrameService', 'systemMessageService',  'confirmationService',
    function ($timeout, $rootScope, $scope, $http, $location, onlineStatus, workspaceService, widgetService, childFrameService, systemMessageService,  confirmationService) {

        $scope.rerender_content = false;

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $scope.loading = true;
            $scope.changeShowEdit(false);
        });
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            $scope.loading = false;
            $scope.newLocation = $location.path();
        });
        $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
            $scope.loading = false;
        });
        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            if (!isOnline) {
                $scope.changeShowEdit(false);
            } else {
                $scope.getAvailableWidgets();
                $scope.rerender_content = true;

            }
            $scope.isOnline = isOnline;
            $scope.online_status_string = onlineStatus.getOnlineStatusString();
        });

        $rootScope.$on('event:auth-loginConfirmed', function () {
            if($scope.rerender_content) {
                $scope.initializeContent();
            }
            $scope.rerender_content = false;
        });

        $rootScope.$on('event:auth-loginRequired', function () {
            $location.path('/dashboard');
        });

        $scope.checkActiveTab = function (url) {
            url = url === 'dashboard' ? '/dashboard' : '/workspace/' + url;
            return url === $scope.newLocation;
        };

        $scope.changeShowEdit = function (show_edit) {
            // always false offline
            if (!$scope.isOnline) {
                $scope.show_edit = false;
            } else {
                $scope.show_edit = show_edit;
            }
        };

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

        // Widget Specific Methods
        $scope.isWidgetVisible = function (widget) {
            // needs a couple of digest cycles to be defined and set
            if ($scope.activeWorkspace === null || $scope.activeWorkspace === undefined) {
                return false;
            }

            return widget.workspace.id === $scope.activeWorkspace.id;
        };

        $scope.deleteWidget = function (widget) {
            confirmationService.confirm('Do you really want to delete this widget?', function () {
                widgetService['delete'](widget, function () {
                    $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
                    systemMessageService.addSuccessMessage('Widget ' + widget.title + ' deleted');
                });
            });
        };
    }]);
