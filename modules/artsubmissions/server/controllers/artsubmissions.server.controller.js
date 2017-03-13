'use strict';


/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artsubmission = mongoose.model('Artsubmission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

// var fs = require('fs'),
//   multer = require('multer'),
//   config = require(path.resolve('./config/config'));
var fileNamee = '';
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './modules/artsubmissions/client/img/profile/uploads/'); //where to store it
  },
  filename: function (req, file, cb) {
    if(!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
      var err = new Error();
      err.code = 'filetype'; // to check on file type
      return cb(err);
    } else {
      fileNamee = Date.now() + '_' + file.originalname;
      Artsubmission.thumbnail = fileNamee;
      // console.log(Artsubmission);
      cb (null, fileNamee);
    }
    // cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).single('myfile'); // name in form

exports.uploads = function (req, res) {
  // console.log('var fileNamee     ' +  fileNamee);
  // var artsubmission = new Artsubmission(req.body);
  // console.log("multer.diskStorage.filename.file.fileName   " + multer.diskStorage.filename.fileNamee);
  // console.log("artsubmission   " + artsubmission);
  // artsubmission.user = req.user;
  // console.log("req.user   " + req.user);
  // console.log("artsubmission after added req.user   " + artsubmission);

  console.log('in uploads func');
  upload(req, res, function (err) {
    // console.log("req.files   " + req.file);
    // console.log("req.body   " + req.body);
    if (err) {
      // An error occurred when uploading
      // return;
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
      } else if (err.code === 'filetype') {
        res.json({ success: false, message: 'File type is invalid. Accepted types are png|jpg|jpeg|pdf' });
      } else {
        console.log('err = ' + err);
        res.json({ success: false, message: 'File was not able to be uploaded' });
      }
    } else {
      if(!req.file) {
        res.json({ success: false, message: 'No File was selected' });
      } else {
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
  console.log('in create functuing');

  if (req.file){
    upload(req, res, function (err) {
      // console.log("req.files   " + req.files);
      // console.log("req.body   " + req.body);
      if (err) {
        // An error occurred when uploading
        // return;
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
        } else if (err.code === 'filetype') {
          res.json({ success: false, message: 'File type is invalid. Accepted types are png|jpg|jpeg|pdf' });
        } else {
          console.log('err = ' + err);
          res.json({ success: false, message: 'File was not able to be uploaded' });
        }
      } else {
        if(!req.file) {
          res.json({ success: false, message: 'No File was selected' });
        }
        else {
          res.json({ success: true, message: 'File was uploaded!' });
        }
        // res.jsonp(artsubmission);
      }
      // Everything went fine
    });

  } else {

    var artsubmission = new Artsubmission(req.body);

    console.log("artsubmission   " + artsubmission);

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


};

// /**
//  * Create a Artsubmission
//  */
// exports.create = function (req, res) {
//   console.dir(req);
//   var artsubmission = new Artsubmission(req.body);
//   artsubmission.user = req.user;
//   var message = null;
//   var upload = multer(config.uploads.imageUpload).single('newImage');
//   var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
//
//   // Filtering to upload only images
//   upload.fileFilter = profileUploadFileFilter;
// // console.log(artsubmission);
//   if (artsubmission) {
//     upload(req, res, function (uploadError) {
//       if (uploadError) {
//         return res.status(400).send({
//           message: 'Error occurred while uploading image'
//         });
//       } else {
//         artsubmission.artImageURL = config.uploads.imageUpload.dest + req.file.filename;
//
//         artsubmission.save(function (saveError) {
//           if (saveError) {
//             return res.status(400).send({
//               message: errorHandler.getErrorMessage(saveError)
//             });
//           } else {
//             req.login(artsubmission.user, function (err) {
//               if (err) {
//                 res.status(400).send(err);
//               } else {
//                 res.jsonp(artsubmission);
//               }
//             });
//           }
//         });
//       }
//     });
//   } else {
//     res.status(400).send({
//       message: 'User is not signed in'
//     });
//   }

  // artsubmission.save(function(err) {
  //     if (err) {
  //         return res.status(400).send({
  //             message: errorHandler.getErrorMessage(err)
  //         });
  //     } else {
  //         res.jsonp(artsubmission);
  //     }
  // });
// };

// /**
//  * Update profile picture
//  */
// exports.changeImage = function (req, res) {
//     // console.log("===================================" + req.artsubmission);
//     var artsubmission = req.artsubmission;
//     var message = null;
//     var upload = multer(config.uploads.imageUpload).single('newImage');
//     var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
//
//     // Filtering to upload only images
//     upload.fileFilter = profileUploadFileFilter;
//
//     if (artsubmission) {
//         upload(req, res, function (uploadError) {
//             if(uploadError) {
//                 return res.status(400).send({
//                     message: 'Error occurred while uploading image'
//                 });
//             } else {
//                 artsubmission.artImageURL = config.uploads.imageUpload.dest + req.file.filename;
//
//                 artsubmission.save(function (saveError) {
//                     if (saveError) {
//                         return res.status(400).send({
//                             message: errorHandler.getErrorMessage(saveError)
//                         });
//                     } else {
//                         req.login(artsubmission, function (err) {
//                             if (err) {
//                                 res.status(400).send(err);
//                             } else {
//                                 res.json(artsubmission);
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     } else {
//         res.status(400).send({
//             message: 'User is not signed in'
//         });
//     }
// };

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

  // console.log("req.user.isadmin------------------------------========");
  //   console.log(req.user.isAdmin);
  // console.log("req.user------------------------------========");
  // console.log(req.user);
  //   console.log("artsubmission.user------------------------------========");
  //   console.log(artsubmission.user);
  //   console.log("artsubmission.user._id.toString()------------------------------========");
  //   console.log(artsubmission.user._id.toString());
  //   console.log("req.user._id.toString()------------------------------========");
  //   console.log(req.user._id.toString() === '58a90398fe06ec0d26aea958');

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
