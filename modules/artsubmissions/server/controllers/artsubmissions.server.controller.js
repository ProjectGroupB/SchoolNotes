'use strict';


/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artsubmission = mongoose.model('Artsubmission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './modules/artsubmissions/client/img/'); //where to store it
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
      console.log('file.size     ' + file.size + " - " + file.fieldname + " - " + file.encoding + " - " + file.path);
      var fileNamee = d + '_' + h + '_'  + file.originalname;
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

        // res.json({ success: false, message: 'No File was selected' });

        var artsubmission = new Artsubmission(req.body);

        // console.log("artsubmission   " + artsubmission);

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

      }
      else if (req.file) {
        res.json({ success: true, message: 'File was uploaded!' });
      }

    }
    // Everything went fine
  });
};

/**
 * Create a Artsubmission
 */
exports.create = function(req, res) {
  var artsubmission = new Artsubmission(req.body);

  // console.log("artsubmission   " + artsubmission);

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
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var artsubmission = req.artsubmission ? req.artsubmission.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  artsubmission.isCurrentUserOwner = req.user && artsubmission.user && artsubmission.user._id.toString() === req.user._id.toString();
  artsubmission.isAdmin = req.user._id.toString() === '58a90398fe06ec0d26aea958';
  artsubmission.zipcode = req.user.zipcode.toString();
  // console.log("artsubmission.userZipCode    " + artsubmission.userZipCode);

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
  console.log('req     ---  ' + req);
  console.log('req.user.zipcode.toString();    ' + req.user.zipcode.toString());
  console.log('req.user._id.toString() === 58a90398fe06ec0d26aea958 ' + (req.user._id.toString() === '58a90398fe06ec0d26aea958'));

  if(req.user._id.toString() !== '58a90398fe06ec0d26aea958') {
    var userZipCode1 = req.user.zipcode.toString();
    Artsubmission.find({ artzipcode: userZipCode1 }).sort('-created').populate('user', 'displayName').exec(function (err, artsubmissions) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(artsubmissions);
      }
    });
  } else {
    Artsubmission.find().sort('-created').populate('user', 'displayName').exec(function (err, artsubmissions) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(artsubmissions);
      }
    });
  }

};

/**
 * Artsubmission middleware
 */
exports.artsubmissionByID = function(req, res, next, id) {
// console.log("test point " + id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Art submission is invalid'
    });
  }

  Artsubmission.findById(id).populate('user', 'displayName').exec(function (err, artsubmission) {
    if (err) {
      return next(err);
    } else if (!artsubmission) {
      return res.status(404).send({
        message: 'No Art submission with that identifier has been found'
      });
    }
    req.artsubmission = artsubmission;
    next();
  });
};
