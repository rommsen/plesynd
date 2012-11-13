'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
 */
Application.Directives.directive('todoFocus', ['$timeout', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.todoFocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
          elem[0].select();
        }, 0, false);
      }
    });
  };
}]);
