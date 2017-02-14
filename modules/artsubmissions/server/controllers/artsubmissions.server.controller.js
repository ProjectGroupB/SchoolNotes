'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artsubmission = mongoose.model('Artsubmission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Artsubmission
 */
exports.create = function(req, res) {
  var artsubmission = new Artsubmission(req.body);
  artsubmission.user = req.user;

  artsubmission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artsubmission);
    }
  });
};

/**
 * Show the current Artsubmission
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var artsubmission = req.artsubmission ? req.artsubmission.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  artsubmission.isCurrentUserOwner = req.user && artsubmission.user && artsubmission.user._id.toString() === req.user._id.toString();

  res.jsonp(artsubmission);
};

/**
 * Update a Artsubmission
 */
exports.update = function(req, res) {
  var artsubmission = req.artsubmission;

  artsubmission = _.extend(artsubmission, req.body);

  artsubmission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artsubmission);
    }
  });
};

/**
 * Delete an Artsubmission
 */
exports.delete = function(req, res) {
  var artsubmission = req.artsubmission;

  artsubmission.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artsubmission);
    }
  });
};

/**
 * List of Artsubmissions
 */
exports.list = function(req, res) {
  Artsubmission.find().sort('-created').populate('user', 'displayName').exec(function(err, artsubmissions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artsubmissions);
    }
  });
};

/**
 * Artsubmission middleware
 */
exports.artsubmissionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Artsubmission is invalid'
    });
  }

  Artsubmission.findById(id).populate('user', 'displayName').exec(function (err, artsubmission) {
    if (err) {
      return next(err);
    } else if (!artsubmission) {
      return res.status(404).send({
        message: 'No Artsubmission with that identifier has been found'
      });
    }
    req.artsubmission = artsubmission;
    next();
  });
};
