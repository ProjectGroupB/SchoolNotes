'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sponsor Schema
 */
var SponsorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sponsor name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Sponsor', SponsorSchema);
