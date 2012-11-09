'use strict';


/**
 * Defines application-wide key value pairs
 */

Application.Constants.constant('configuration',   {
        LOGIN_URL : 'http://plesynd/app_dev.php/login',
        LOGOUT_URL : 'http://plesynd/app_dev.php/logout',
        'TODO_RESOURCE_URI' : 'http://plesynd/app_dev.php/todo/api/todos/:todoId',
        'TODO_LIST_RESOURCE_URI' : 'http://plesynd/app_dev.php/todo/api/lists/:todoListId'
    }
);