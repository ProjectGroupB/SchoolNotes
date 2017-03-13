'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Artsubmission Schema
 */
var ArtsubmissionSchema = new Schema({
  name: {
    type: String,
    default: '',
    // required: 'Please fill Art submission name',
    trim: true
  },
  age: {
    type: String,
    default: '',
    // required: 'Please fill Art submission age',
    trim: true
  },
  address: {
    type: String,
    default: '',
    // required: 'Please fill Art submission address',
    trim: true
  },
  zipcode: {
    type: String,
    default: '',
    // required: 'Please fill Art submission zip code',
    trim: true
  },
  thumbnail: {
    type: String,
    default: 'modules/artsubmissions/client/img/profile/default.png'
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

mongoose.model('Artsubmission', ArtsubmissionSchema);
