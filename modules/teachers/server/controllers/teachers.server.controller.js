'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Teacher = mongoose.model('Teacher'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Teacher
 */
exports.create = function(req, res) {
  var teacher = new Teacher(req.body);
  teacher.user = req.user;

  teacher.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(teacher);
    }
  });
};

/**
 * Show the current Teacher
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var teacher = req.teacher ? req.teacher.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  teacher.isCurrentUserOwner = req.user && teacher.user && teacher.user._id.toString() === req.user._id.toString();

  res.jsonp(teacher);
};

/**
 * Update a Teacher
 */
exports.update = function(req, res) {
  var teacher = req.teacher;

  teacher = _.extend(teacher, req.body);

  teacher.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(teacher);
    }
  });
};

/**
 * Delete an Teacher
 */
exports.delete = function(req, res) {
  var teacher = req.teacher;

  teacher.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(teacher);
    }
  });
};

/**
 * List of Teachers
 */
exports.list = function(req, res) {
  Teacher.find().sort('-created').populate('user', 'displayName').exec(function(err, teachers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(teachers);
    }
  });
};

/**
 * Teacher middleware
 */
exports.teacherByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Teacher is invalid'
    });
  }

  Teacher.findById(id).populate('user', 'displayName').exec(function (err, teacher) {
    if (err) {
      return next(err);
    } else if (!teacher) {
      return res.status(404).send({
        message: 'No Teacher with that identifier has been found'
      });
    }
    req.teacher = teacher;
    next();
  });
};
