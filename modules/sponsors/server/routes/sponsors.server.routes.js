'use strict';

/**
 * Module dependencies
 */
var sponsorsPolicy = require('../policies/sponsors.server.policy'),
  sponsors = require('../controllers/sponsors.server.controller');

module.exports = function(app) {
  // Sponsors Routes
  app.route('/api/sponsors').all(sponsorsPolicy.isAllowed)
    .get(sponsors.list)
    // .post(sponsors.create);
    .post(sponsors.uploads);

  app.route('/api/sponsors/:sponsorId').all(sponsorsPolicy.isAllowed)
    .get(sponsors.read)
    .put(sponsors.update)
    .delete(sponsors.delete);

  // Finish by binding the Sponsor middleware
  app.param('sponsorId', sponsors.sponsorByID);
};
