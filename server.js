'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
    mongoose = require('./config/lib/mongoose'),
    express = require('./config/lib/express'),
    chalk = require('chalk'),
    seed = require('./config/lib/seed'),
    keystone = require('keystone');
mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    keystone.init({
        'name': 'School Notes Magazine',
        'brand': 'School Notes Magazine',
        'session': true,
        'updates': 'updates',
        'auto update': false,
        'cookie secret':config.sessionCookie,
        'user model':'User',
        'auth': function(req,res,next) {
            //add your auth here
            // should check the roles array for admin rights
            next();
        }
    });
    keystone.app = app;
});

var app = require('./config/lib/app');
var server = app.start();

