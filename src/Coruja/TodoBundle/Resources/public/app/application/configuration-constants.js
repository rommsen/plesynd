'use strict';


/**
 * Defines application-wide key value pairs
 */

Application.Constants.constant('configuration',   {
        LOGIN_URL : base_url+'/login',
        LOGOUT_URL : base_url+'/logout',
        CONFIRM_URL : base_url+'/user/confirm/',
        TODO_RESOURCE_URI : base_url+'/todo/api/todos/:todoId',
        TODO_LIST_RESOURCE_URI : base_url+'/todo/api/lists/:todoListId'
    }
);