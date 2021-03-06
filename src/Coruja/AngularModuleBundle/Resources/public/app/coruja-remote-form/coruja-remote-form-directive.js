'use strict';

/**
 * Angular Directives
 *
 * @module Application.Directives
 */

/**
 * Provides a mechanism to validate Forms on the server
 *
 * @class remoteForm
 */
Application.Directives.directive('remoteForm', ['$http',
    /**
     * @method Factory
     * @param $http
     * @returns {{restrict: string, scope: boolean, controller: Array, link: Function}}
     */
    function ($http) {
        function IllegalArgumentException (message) {
            this.message = message;
        }

        var forEach = angular.forEach;

        return {
            'restrict' : 'A',
            'scope' : true,
            'controller' : ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                var self = this;
                self.formComponents = {};
                self.registerFormComponent = function (name, ngModel) {
                    self.formComponents[name] = ngModel;
                };
                self.hasFormComponent = function (name) {
                    return self.formComponents[name] != undefined;
                };
                self.getFormComponent = function (name) {
                    return self.formComponents[name];
                };

                /**
                 * Every submit should reset the form component, because its possible
                 * that the error is gone, but the form is still not valid
                 */
                self.resetFormComponentsValidity = function () {
                    forEach(self.formComponents, function (component) {
                        component.$setValidity('server', true);
                    });
                };

                $scope.serverValidationError = {};
                $scope.target = $attrs.target;
                $scope.success = $attrs.success;
                $scope.method = $attrs.method || 'post';
                // error code defaults to 400
                $scope.validation_error_code = $attrs.errorCode || 400;
                // property path defaults to propertyPath
                $scope.property_path_key = $attrs.propertyPath || 'propertyPath';
                // message key defaults to message
                $scope.message_key = $attrs.message || 'message';
                if ($scope.target == undefined) {
                    throw new IllegalArgumentException('target must be defined');
                }

                $scope.is_submitted = false;
                $scope.submit = function (formData) {
                    $scope.formData = formData;
                    $scope.is_submitted = true;
                    self.resetFormComponentsValidity();
                };
            }],

            'link' : function (scope, element, attrs, ctrl) {
                scope.$watch('is_submitted', function (is_submitted) {
                    if (!is_submitted) {
                        return;
                    }
                    $http[scope.method].apply($http, [scope.target, scope.formData])
                        .success(function () {
                            if ((typeof scope[scope.success]) == 'function') {
                                scope[scope.success]();
                            }
                        })
                        .error(function (data, status) {
                            if (status == scope.validation_error_code) {
                                forEach(data, function (item) {
                                    var form_component_name = item[scope.property_path_key];
                                    if (ctrl.hasFormComponent(form_component_name)) {
                                        ctrl.getFormComponent(form_component_name).$setValidity('server', false);
                                        scope.serverValidationError[form_component_name] = item[scope.message_key];
                                    }
                                });
                            }
                        });
                    scope.is_submitted = false;
                });
            }
        };
    }])
    .directive('remoteFormComponent', [function () {
    return {
        'restrict' : 'A',
        'require' : ['^remoteForm', 'ngModel'],

        'link' : function (scope, element, attrs, ctrls) {
            var formCtrl = ctrls[0],
                ngModel = ctrls[1];
            formCtrl.registerFormComponent(attrs.name, ngModel);
        }
    };
}]);