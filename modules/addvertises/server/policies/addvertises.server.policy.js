'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Addvertises Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/addvertises',
      permissions: '*'
    }, {
      resources: '/api/addvertises/:addvertiseId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/addvertises',
      permissions: ['get', 'post']
    }, {
      resources: '/api/addvertises/:addvertiseId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/addvertises',
      permissions: ['get']
    }, {
      resources: '/api/addvertises/:addvertiseId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Addvertises Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Addvertise is being processed and the current user created it then allow any manipulation
  if (req.addvertise && req.user && req.addvertise.user && req.addvertise.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
