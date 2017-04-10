'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

//upload function
var _ = require('lodash');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './modules/articles/client/img/'); //where to store it
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

              var article = new Article(req.body);
              article.user = req.user;

              article.save(function (err) {
                  if (err) {
                      return res.status(400).send({
                          message: errorHandler.getErrorMessage(err)
                      });
                  } else {
                      res.json(article);
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
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;

  console.log('updating article');

  article.title = req.body.title;
  article.content = req.body.content;
  article.status = req.body.status;
  article.comments = req.body.comments;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};


/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};


/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.findForReview().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
