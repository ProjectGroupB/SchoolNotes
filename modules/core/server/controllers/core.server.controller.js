'use strict';
var mongoose = require('mongoose');
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });

};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.artList = function(req, res) {
  var database = mongoose.connection;
  var artworks = database.collection('artsubmissions');
  var slides = [];
  console.log('can I get a read?');
  artworks.find().toArray(function(err, artwork){
    if (err){
      return res.send(400, {
        message: 'artworks not found'
      });
    } else {
      slides = new Array(artwork.length);
      for (var i = 0; i < artwork.length; i++){
        var slide = {
          id: artwork[i]._id,
          image: artwork[i].thumbnail
        };
        slides[i] = slide;
      }
      res.jsonp(slides);
    }
  });
  //console.log('the length is ' + slides.length);
  //return slides;
};

