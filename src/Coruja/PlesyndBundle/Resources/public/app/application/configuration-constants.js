'use strict';

/**
 * Assembles needed submodules and defines routing
 *
 * @module Plesynd
 * @class application
 */
Application.Constants.constant('configuration',   {
        LOGIN_URL : 'login_check',
        LOGOUT_URL : 'logout',
        CONFIRM_URL : 'user/confirm/',
        WIDGET_RESOURCE_URI : 'plesynd/api/widgets/:widgetId',
        WIDGET_AVAILABLE_RESOURCE_URI : 'plesynd/api/widgets/available',
        WORKSPACE_RESOURCE_URI : 'plesynd/api/workspaces/:id'
    }
);