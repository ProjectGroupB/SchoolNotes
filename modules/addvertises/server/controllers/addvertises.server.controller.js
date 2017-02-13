'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Addvertise = mongoose.model('Addvertise'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Addvertise
 */
exports.create = function(req, res) {
  var addvertise = new Addvertise(req.body);
  addvertise.user = req.user;

  addvertise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addvertise);
    }
  });
};

/**
 * Show the current Addvertise
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var addvertise = req.addvertise ? req.addvertise.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  addvertise.isCurrentUserOwner = req.user && addvertise.user && addvertise.user._id.toString() === req.user._id.toString();

  res.jsonp(addvertise);
};

/**
 * Update a Addvertise
 */
exports.update = function(req, res) {
  var addvertise = req.addvertise;

  addvertise = _.extend(addvertise, req.body);

  addvertise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addvertise);
    }
  });
};

/**
 * Delete an Addvertise
 */
exports.delete = function(req, res) {
  var addvertise = req.addvertise;

  addvertise.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addvertise);
    }
  });
};

/**
 * List of Addvertises
 */
exports.list = function(req, res) {
  Addvertise.find().sort('-created').populate('user', 'displayName').exec(function(err, addvertises) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addvertises);
    }
  });
};

/**
 * Addvertise middleware
 */
exports.addvertiseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Addvertise is invalid'
    });
  }

  Addvertise.findById(id).populate('user', 'displayName').exec(function (err, addvertise) {
    if (err) {
      return next(err);
    } else if (!addvertise) {
      return res.status(404).send({
        message: 'No Addvertise with that identifier has been found'
      });
    }
    req.addvertise = addvertise;
    next();
  });
};
