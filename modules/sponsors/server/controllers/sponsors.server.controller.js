'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sponsor = mongoose.model('Sponsor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './modules/sponsors/client/img/'); //where to store it
    },
    filename: function (req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
            var err = new Error();
            err.code = 'filetype'; // to check on file type
            return cb(err);
        } else {
            var day = new Date();
            var d = day.getDay();
            var h = day.getHours();
            var fileNamee = d + '_' + h + '_' + file.originalname;
            // console.log(fileNamee);
            cb (null, fileNamee);
        }
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 20971520 } // Max file size: 20MB
}).single('myfile'); // name in form

exports.uploads = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'File size is too large. Max limit is 20MB' });
            } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'File type is invalid. Accepted types are .png/.jpg/.jpeg/.pdf' });
            } else {
                console.log('err = ' + err);
                res.json({ success: false, message: 'File was not able to be uploaded' });
            }
        } else {
            if(!req.file) {
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

            }
            else if (req.file) {
                res.json({ success: true, message: 'File was uploaded!' });
            }

        }
        // Everything went fine
    });
};


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
exports.update = function (req, res) {
  var sponsor = req.sponsor;

  sponsor = _.extend(sponsor, req.body);

  sponsor.name = req.body.name;
  sponsor.contact = req.body.contact;
  sponsor.email = req.body.email;
  sponsor.message = req.body.message;
  sponsor.phone = req.body.phone;

  sponsor.save(function (err) {
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
