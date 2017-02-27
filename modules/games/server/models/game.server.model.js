'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Schema
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
  answerLine: {
    type: String,
    default: '',
    required: 'Please fill at least one word to search for',
  trim: true
  },
  line1: {
    type: String,
    default:'A B C D E F G H I J K L M N O',
    trim: true
  },
  line2: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line3: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line4: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line5: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line6: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line7: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line8: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line9: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line10: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line11: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line12: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line13: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line14: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  },
  line15: {
      type: String,
      default:'A B C D E F G H I J K L M N O',
      trim: true
  }
});

mongoose.model('Game', GameSchema);
