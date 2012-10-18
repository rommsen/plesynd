'use strict'

/**
 * Defines application-wide key value pairs
 */

Application.Services.factory('configuration', function() {
    return {
        'WIDGET_RESOURCE_URI' : 'plesynd/api/widgets/:widgetId',
        'WORKSPACE_RESOURCE_URI' : 'plesynd/api/workspaces/:id'
    }
});