'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contactu Schema
 */
var ContactuSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Contactu name',
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

mongoose.model('Contactu', ContactuSchema);
