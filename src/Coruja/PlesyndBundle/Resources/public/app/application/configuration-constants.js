'use strict';

/**
 * Defines application-wide key value pairs
 */

Application.Constants.constant('configuration',   {
        LOGIN_URL : 'http://plesynd/app_dev.php/login',
        LOGOUT_URL : 'http://plesynd/app_dev.php/logout',
        CONFIRM_URL : 'http://plesynd/app_dev.php/user/confirm/',
        WIDGET_RESOURCE_URI : 'plesynd/api/widgets/:widgetId',
        WORKSPACE_RESOURCE_URI : 'plesynd/api/workspaces/:id'
    }
);