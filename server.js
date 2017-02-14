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
        'brand': 'Website Brand',
        'session': true,
        'updates': 'updates',
        'auth': true,
        'user model': 'User',
        'auto update': true,
    });
    keystone.app = app;
});

var app = require('./config/lib/app');
var server = app.start();
