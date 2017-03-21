'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Schema
 * the word search game is merged in this model, but I think I would like each game type to have its own model
 */
var GameSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Game name',
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
  type: {
    type: String,
    default: ''
  },
  paragraph: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 1
  },
  hasletters: {
    type: Boolean,
    default: false
  },
  word1: {
    type: String,
    default: ''
  },
  scram1: {
    type: String,
    default: ''
  },
  letterpos1: {
    type: Number,
    default: 0
  },
  word2: {
    type: String,
    default: ''
  },
  scram2: {
    type: String,
    default: ''
  },
  letterpos2: {
    type: Number,
    default: 0
  },
  word3: {
    type: String,
    default: ''
  },
  scram3: {
    type: String,
    default: ''
  },
  letterpos3: {
    type: Number,
    default: 0
  },
  word4: {
    type: String,
    default: ''
  },
  scram4: {
    type: String,
    default: ''
  },
  letterpos4: {
    type: Number,
    default: 0
  },
  word5: {
    type: String,
    default: ''
  },
  scram5: {
    type: String,
    default: ''
  },
  letterpos5: {
    type: Number,
    default: 0
  },
  word6: {
    type: String,
    default: ''
  },
  scram6: {
    type: String,
    default: ''
  },
  letterpos6: {
    type: Number,
    default: 0
  },
  word7: {
    type: String,
    default: ''
  },
  scram7: {
    type: String,
    default: ''
  },
  letterpos7: {
    type: Number,
    default: 0
  },
  word8: {
    type: String,
    default: ''
  },
  scram8: {
    type: String,
    default: ''
  },
  letterpos8: {
    type: Number,
    default: 0
  },
  word9: {
    type: String,
    default: ''
  },
  scram9: {
    type: String,
    default: ''
  },
  letterpos9: {
    type: Number,
    default: 0
  },
  word10: {
    type: String,
    default: ''
  },
  scram10: {
    type: String,
    default: ''
  },
  letterpos10: {
    type: Number,
    default: 0
  },
  word11: {
    type: String,
    default: ''
  },
  scram11: {
    type: String,
    default: ''
  },
  letterpos11: {
    type: Number,
    default: 0
  },
  word12: {
    type: String,
    default: ''
  },
  scram12: {
    type: String,
    default: ''
  },
  letterpos12: {
    type: Number,
    default: 0
  },
  word13: {
    type: String,
    default: ''
  },
  scram13: {
    type: String,
    default: ''
  },
  letterpos13: {
    type: Number,
    default: 0
  },
  word14: {
    type: String,
    default: ''
  },
  scram14: {
    type: String,
    default: ''
  },
  letterpos14: {
    type: Number,
    default: 0
  },
  word15: {
    type: String,
    default: ''
  },
  scram15: {
    type: String,
    default: ''
  },
  letterpos15: {
    type: Number,
    default: 0
  },
  word16: {
    type: String,
    default: ''
  },
  scram16: {
    type: String,
    default: ''
  },
  letterpos16: {
    type: Number,
    default: 0
  },
  word17: {
    type: String,
    default: ''
  },
  scram17: {
    type: String,
    default: ''
  },
  letterpos17: {
    type: Number,
    default: 0
  },
  word18: {
    type: String,
    default: ''
  },
  scram18: {
    type: String,
    default: ''
  },
  letterpos18: {
    type: Number,
    default: 0
  },
  word19: {
    type: String,
    default: ''
  },
  scram19: {
    type: String,
    default: ''
  },
  letterpos19: {
    type: Number,
    default: 0
  },
  word20: {
    type: String,
    default: ''
  },
  scram20: {
    type: String,
    default: ''
  },
  letterpos20: {
    type: Number,
    default: 0
  }
});

mongoose.model('WordScramble', GameSchema, 'games');
