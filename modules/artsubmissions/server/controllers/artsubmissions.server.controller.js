'use strict';


/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artsubmission = mongoose.model('Artsubmission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

//for gmail emails
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var fs = require('fs');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'schoolnotesmag@gmail.com',
      clientId: '42237668430-if8295pt17itra6j98iap5mf91t16k2j.apps.googleusercontent.com',
      clientSecret: '1ASR1PV5N9Yj0dRUCoG9l5-X',
      refreshToken: '1/RLJjSvRWZ1kS8KmQ6EqEZEPvMzb2HT-3EqgxYh1WI4ts_N1m8033P5L_Hc5vYUqE',
      accessToken: 'ya29.GlssBFbJ-xS1l88zvUNJ1WUrBh7Vr3dpBDyJpVomRN1BIbOggEpR70TT8mhqt6lPCYZPpWbmXLge9ZC97MnQX6jPCGwr4Huvpvz4VazlBhqbJVFCSVI-DGAbJOO_'
    })
  },
});



// for upload images/pdfs
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
      console.log('file.size     ' + file.size + ' - ' + file.fieldname + ' - ' + file.encoding + ' - ' + file.path);
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
  console.log('in uploads sadf 8900')
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
    } else if (req.file) {
      res.json({ success: true, message: 'File was uploaded!' });
    }
    else {
      var artsub = new Artsubmission(req.body);

      if(artsub.name.length === 0 || artsub.teacherName.length === 0 || artsub.email.length === 0 ||
        artsub.school.length === 0 || artsub.grade.length === 0 || artsub.artzipcode.length === 0){
        res.json({ success: false, message: 'File was not selected, Please select a file by clicking on browse button above' });
      } else if (!req.file) {

        var artsubmission = new Artsubmission(req.body);
        artsubmission.user = req.user;
        artsubmission.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {

            var mailOptions = {
              // from: 'SchoolNotes <schoolnotesmag@gmail.com>',
              from: artsubmission.email,
              to: 'schoolnotesmag@gmail.com',
              subject: 'New Art Work Post from ' + artsubmission.name,
              text: artsubmission.name,
              html: 'name: ' + artsubmission.name + '<br><br> Teacher Name: ' + artsubmission.teacherName +
              '<br><br> School: ' + artsubmission.school + '<br><br> Grade: ' + artsubmission.grade +
              '<br><br> Zip Code: ' + artsubmission.artzipcode + '<br><br> Email: ' + artsubmission.email +
              '<br><br> Message from Artist: ' + artsubmission.message +
              '<br><br> link to ArtWork post: http://localhost:3000/artsubmissions/' + artsubmission._id
              // '<br> link to ArtWork post: https://schoolnotes3.herokuapp.com/artsubmissions/'+artsubmission._id
              // attachments:[
              //   {
              //     streamSource: fs.createReadStream(artsubmission.thumbnail)
              //   }
              // ]
            };

            transporter.sendMail(mailOptions, function (err, res) {
              if (err) {
                console.log('Error');
                console.log(err);
              } else {
                console.log('Email Sent, horaaaay');
              }

            });

            res.jsonp(artsubmission);
          }
        });

      }

    }
    // Everything went fine
  });
};

/**
 * Create a Artsubmission
 */
exports.create = function(req, res) {
  console.log('in create --- ');
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
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var artsubmission = req.artsubmission ? req.artsubmission.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  artsubmission.isCurrentUserOwner = req.user && artsubmission.user && artsubmission.user._id.toString() === req.user._id.toString();
  artsubmission.isAdmin = req.user._id.toString() === '58a90398fe06ec0d26aea958';
  artsubmission.zipcode = req.user.zipcode.toString();

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
      console.log('req   ' + req);
      console.log('artsubmission    ' + artsubmission);

      if(artsubmission.sendEmail){
        var mailOptions = {
          from: 'SchoolNotes <schoolnotesmag@gmail.com>',
          to: artsubmission.email,
          subject: artsubmission.emailSubject,
          text: artsubmission.emailMessage,
          html: artsubmission.emailMessage + '<br><br><br><br> name: ' + artsubmission.name + '<br><br> Teacher Name: ' + artsubmission.teacherName +
          '<br><br> School: ' + artsubmission.school + '<br><br> Grade: ' + artsubmission.grade +
          '<br><br> Zip Code: ' + artsubmission.artzipcode + '<br><br> Email: ' + artsubmission.email +
          '<br><br> Message from Artist: ' + artsubmission.message +
          '<br><br> link to ArtWork post: http://localhost:3000/artsubmissions/' + artsubmission._id
        };

        transporter.sendMail(mailOptions, function(err, res) {
          if(err){
            console.log('Error');
            console.log(err);
          } else {
            console.log('Email Sent, horaaaay');
            artsubmission.sendEmail = false;
          }

        });
      }

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
