'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Artsubmissions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/artsubmissions',
      permissions: '*'
    }, {
      resources: '/api/artsubmissions/:artsubmissionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/artsubmissions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/artsubmissions/:artsubmissionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/artsubmissions',
      permissions: ['get']
    }, {
      resources: '/api/artsubmissions/:artsubmissionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Artsubmissions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
// console.log("sadfasdf asdf " + req.user.roles);
  // If an Artsubmission is being processed and the current user created it then allow any manipulation
  if (req.artsubmission && req.user && req.artsubmission.user && req.artsubmission.user.id === req.user.id) {
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
