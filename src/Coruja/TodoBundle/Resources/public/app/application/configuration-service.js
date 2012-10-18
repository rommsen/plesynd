'use strict'

/**
 * Defines application-wide key value pairs
 */

Application.Services.factory('configuration', function() {
    return {
        'TODO_RESOURCE_URI' : 'http://plesynd/app_dev.php/todo/api/todos/:todoId',
        'TODO_LIST_RESOURCE_URI' : 'http://plesynd/app_dev.php/todo/api/lists/:todoListId'
    }
});