'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Event
 */
exports.create = function(req, res) {
  var event = new Event(req.body);
  event.user = req.user;

  event.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(event);
    }
  });
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var event = req.event ? req.event.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  event.isCurrentUserOwner = req.user && event.user && event.user._id.toString() === req.user._id.toString();

  res.jsonp(event);
};

/**
 * Update a Event
 */
exports.update = function(req, res) {
  var event = req.event;

  event = _.extend(event, req.body);

  event.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(event);
    }
  });
};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
  var event = req.event;

  event.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(event);
    }
  });
};

/**
 * List of Events
 */
exports.list = function(req, res) {
  Event.find().sort('-created').populate('user', 'displayName').exec(function(err, events) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(events);
    }
  });
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Event is invalid'
    });
  }

  Event.findById(id).populate('user', 'displayName').exec(function (err, event) {
    if (err) {
      return next(err);
    } else if (!event) {
      return res.status(404).send({
        message: 'No Event with that identifier has been found'
      });
    }
    req.event = event;
    next();
  });
};
