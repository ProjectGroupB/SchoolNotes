'use strict';

/**
 * Module dependencies
 */
var addvertisesPolicy = require('../policies/addvertises.server.policy'),
  addvertises = require('../controllers/addvertises.server.controller');

module.exports = function(app) {
  // Addvertises Routes
  app.route('/api/addvertises').all(addvertisesPolicy.isAllowed)
    .get(addvertises.list)
    .post(addvertises.create);

  app.route('/api/addvertises/:addvertiseId').all(addvertisesPolicy.isAllowed)
    .get(addvertises.read)
    .put(addvertises.update)
    .delete(addvertises.delete);

  // Finish by binding the Addvertise middleware
  app.param('addvertiseId', addvertises.addvertiseByID);
};
