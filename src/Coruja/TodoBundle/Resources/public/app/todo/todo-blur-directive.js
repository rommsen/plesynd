'use strict';

/**
 * TodoWidget Directives
 *
 * @module TodoWidget.Directives
 */

/**
 * Directive that executes an expression when the element it is applied to loses focus.
 *
 * @class todoBlur
 */
Application.Directives.directive('todoBlur', [function() {
  return function( scope, elem, attrs ) {
    elem.bind('blur', function() {
      scope.$apply(attrs.todoBlur);
    });
  };
}]);
