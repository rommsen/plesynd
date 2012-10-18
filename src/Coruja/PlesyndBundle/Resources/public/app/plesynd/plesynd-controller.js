'use strict';

/* Controllers */
Application.Controllers.controller('PlesyndCtrl',
    function ($rootScope, $scope, $http, $location, onlineStatus, workspaceService, widgetService, childFrameService, authService, systemMessageService) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $scope.loading = true;
            $scope.changeShowEdit(false);;
        });
        $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
            $scope.loading = false;
            $scope.newLocation = $location.path();
        });
        $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
            alert("ROUTE CHANGE ERROR: " + rejection);
            $scope.loading = false;
        });
        $rootScope.$on('onlineChanged', function (evt, isOnline) {
            if(!isOnline) {
                $scope.changeShowEdit(false);
            }
            $scope.isOnline = isOnline;
            $scope.online_status_string = onlineStatus.getOnlineStatusString();
        });

        $rootScope.$on('event:auth-loginConfirmed', function () {
            $scope.initializeContent();
        });

        $scope.checkActiveTab = function (url) {
            url = url == 'dashboard' ? '/dashboard' : '/workspace/' + url;
            return url == $scope.newLocation;
        };

        $scope.changeShowEdit = function(show_edit) {
            // always false offline
            if(!$scope.isOnline) {
                $scope.show_edit = false;
            } else {
                $scope.show_edit = show_edit;
            }
        }

        $scope.initializeContent = function() {
            $scope.workspaces = workspaceService.query();
            $scope.widgets = widgetService.query(function (widgets) {
                childFrameService.setWidgets(widgets);
            });

            // get the widgets for the selectbox
            $scope.availableWidgets = [];
            $http.get('plesynd/api/widgets/available').success(function (widgets) {
                for (var id in widgets) {
                    $scope.availableWidgets.push(widgets[id]);
                }
            });
        };

        $scope.isOnline = onlineStatus.isOnline();
        $scope.online_status_string = onlineStatus.getOnlineStatusString();
        $scope.initializeContent();

        $scope.addWorkspace = function () {
            var workspace = workspaceService.createEntity({
                'title':'untitled ',
                'widgets':[]
            });
            workspaceService.post(workspace, function () {
                $scope.workspaces.push(workspace);
                $location.path('/workspace/' + workspace.id);
                systemMessageService.addSuccessMessage('Workspace added')
            });
        };

        // Widget Specific Methods
        $scope.isWidgetVisible = function (widget) {
            // needs a couple of digest cycles to be defined and set
            if ($scope.activeWorkspace == undefined) {
                return false;
            }
            return  widget.workspace.id == $scope.activeWorkspace.id;
        };

        $scope.renderWidgetIframe = function (widget) {
            return '<iframe src="' + widget.instance.url + '" name="' + widget.instance_identifier + '" width=' + widget.instance.width + ' height=' + widget.instance.height + '></iframe>';
        };

        $scope.deleteWidget = function (widget) {
            widgetService.delete(widget, function () {
                $scope.widgets.splice($scope.widgets.indexOf(widget), 1);
                systemMessageService.addSuccessMessage('Widget '+widget.title+' deleted');
            });
        };

        $scope.logout = function () {
            $location.path('/dashboard');
            $scope.workspaces = [];
            $scope.widgets = [];
            $scope.availableWidgets = [];
            $http.defaults.headers.common['Authorization'] = "Basic " + btoa('#' + ":" + '#');
            $http.get('plesynd/api/logout');
            $scope.is_authenticated = false;
            systemMessageService.addSuccessMessage('See you next time');
        };
    });

