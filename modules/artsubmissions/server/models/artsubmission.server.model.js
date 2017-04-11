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
  teacherName: {
    type: String,
    default: '',
    // required: 'Please fill Art submission name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    // required: 'Please fill Art submission email',
    trim: true
  },
  school: {
    type: String,
    default: '',
    // required: 'Please fill Art submission school',
    trim: true
  },
  grade: {
    type: String,
    default: '',
    // required: 'Please fill Art submission age',
    trim: true
  },
  // address: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Art submission address',
  //   trim: true
  // },
  // city: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Art submission city',
  //   trim: true
  // },
  // state: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Art submission state',
  //   trim: true
  // },
  zipcode: {
    type: Number
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  // status: {
  //   type: String,
  //   default: 'Pending',
  //   trim: true
  // },
  thumbnail: {
    type: String
  },
  submitterPic: {
      type: String
  },
  AdminNotes: {
    type: String,
    default: '',
    trim: true
  },
  approved: {
    type: Boolean,
  },
  rejected: {
    type: Boolean,
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
