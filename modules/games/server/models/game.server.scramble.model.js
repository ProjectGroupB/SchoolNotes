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
  }
  // TODO save all these things, the 3 things with a number need to be saved as #1 through #20
  //vm.game.size
  //vm.game.hasletters
  //vm.game.word1
  //vm.game.scram1
  //vm.game.letterpos1
});

mongoose.model('WordScramble', GameSchema, 'games');
