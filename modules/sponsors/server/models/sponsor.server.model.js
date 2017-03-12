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
    required: 'Please fill sponsor name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  upload: {
    type: String,
    default: ''
  },
  contact: {
    type: String,
    default: '',
    required: 'Please fill name of contact',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please provide an email',
    trim: true
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    required: 'Please provide a phone number',
    trim: true
  }

});

mongoose.model('Sponsor', SponsorSchema);
