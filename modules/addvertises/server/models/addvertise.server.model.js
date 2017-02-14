'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Addvertise Schema
 */
var AddvertiseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Addvertise name',
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

mongoose.model('Addvertise', AddvertiseSchema);
