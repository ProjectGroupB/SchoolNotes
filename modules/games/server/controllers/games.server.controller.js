'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Game = mongoose.model('Game'),
  WordSearch = mongoose.model('WordSearch'),
  WordScramble = mongoose.model('WordScramble'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './modules/games/client/img/'); //where to store it
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

        // res.json({ success: false, message: 'No File was selected' });

        var game = new Game(req.body);

        // console.log("artsubmission   " + artsubmission);

        game.user = req.user;

        game.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(game);
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
 * Create a Game
 */
exports.create = function(req, res) {
  var gameType = req.body.type;
  var game = new Game(req.body);
  //console.log(gameType);
  /* detect the game type and use the correct schema */
  if (gameType === 'wordsearch') {
    //console.log('creating a Word-Search game');
    game = new WordSearch(req.body);
  } else if (gameType === 'wordscramble') {
    //console.log('creating a Word-Scramble schema');
    game = new WordScramble(req.body);
  } else if (gameType === 'maze'){

  } else {
    console.log('Unknown game type');
    //game = new Game(req.body);
  }
  game.user = req.user;

  game.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * Show the current Game
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var game = req.game ? req.game.toJSON() : {};
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  game.isCurrentUserOwner = req.user && game.user && game.user._id.toString() === req.user._id.toString();

  res.jsonp(game);
};

/**
 * Update a Game
 */
exports.update = function(req, res) {

  var game = req.game;
  var gameType = game.type;
  var updatedGame;
  if (gameType === 'wordsearch') {
    updatedGame = new WordSearch(game);
  } else if (gameType === 'wordscramble') {
    updatedGame = new WordScramble(game);
  } else {
    console.log('Unknown game type');
    updatedGame = new Game(game);
  }
  game = updatedGame.init(req.body);
  //game = _.extend(game, req.body); // this is the old method that didn't work

  game.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * Delete an Game
 */
exports.delete = function(req, res) {
  var game = req.game;

  game.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * List of Games
 */
exports.list = function(req, res) {
  Game.find().sort('-created').populate('user', 'displayName').exec(function(err, games) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(games);
    }
  });
};

/**
 * Game middleware
 */
exports.gameByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Game is invalid'
    });
  }

  Game.findById(id).populate('user', 'displayName').exec(function (err, game) {
    if (err) {
      return next(err);
    } else if (!game) {
      return res.status(404).send({
        message: 'No Game with that identifier has been found'
      });
    }
    req.game = game;
    next();
  });
};
