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
    required: 'Please fill Artsubmission name',
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

mongoose.model('Artsubmission', ArtsubmissionSchema);
