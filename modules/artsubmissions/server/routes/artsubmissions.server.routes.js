'use strict';

/**
 * Module dependencies
 */
var artsubmissionsPolicy = require('../policies/artsubmissions.server.policy'),
  artsubmissions = require('../controllers/artsubmissions.server.controller');

module.exports = function(app) {
  // Artsubmissions Routes
  app.route('/api/artsubmissions').all(artsubmissionsPolicy.isAllowed)
    .get(artsubmissions.list)
    // .post(artsubmissions.create);
    .post(artsubmissions.uploads);

  app.route('/api/artsubmissions/:artsubmissionId').all(artsubmissionsPolicy.isAllowed)
    .get(artsubmissions.read)
    .put(artsubmissions.update)
    .delete(artsubmissions.delete);

  //api/users/picture
  // app.route('/api/artsubmissions/create').post(artsubmissions.uploads);
    // .post(artsubmissions.create);
    // .post(artsubmissions.changeImage);

  // app.route('/api/artsubmissions/create').post(artsubmissions.uploads);

  // Finish by binding the Artsubmission middleware
  app.param('artsubmissionId', artsubmissions.artsubmissionByID);

};
