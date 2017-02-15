'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sponsor = mongoose.model('Sponsor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sponsor
 */
exports.create = function(req, res) {
  var sponsor = new Sponsor(req.body);
  sponsor.user = req.user;

  sponsor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sponsor);
    }
  });
};

/**
 * Show the current Sponsor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sponsor = req.sponsor ? req.sponsor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sponsor.isCurrentUserOwner = req.user && sponsor.user && sponsor.user._id.toString() === req.user._id.toString();

  res.jsonp(sponsor);
};

/**
 * Update a Sponsor
 */
exports.update = function(req, res) {
  var sponsor = req.sponsor;

  sponsor = _.extend(sponsor, req.body);

  sponsor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sponsor);
    }
  });
};

/**
 * Delete an Sponsor
 */
exports.delete = function(req, res) {
  var sponsor = req.sponsor;

  sponsor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sponsor);
    }
  });
};

/**
 * List of Sponsors
 */
exports.list = function(req, res) {
  Sponsor.find().sort('-created').populate('user', 'displayName').exec(function(err, sponsors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sponsors);
    }
  });
};

/**
 * Sponsor middleware
 */
exports.sponsorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sponsor is invalid'
    });
  }

  Sponsor.findById(id).populate('user', 'displayName').exec(function (err, sponsor) {
    if (err) {
      return next(err);
    } else if (!sponsor) {
      return res.status(404).send({
        message: 'No Sponsor with that identifier has been found'
      });
    }
    req.sponsor = sponsor;
    next();
  });
};
