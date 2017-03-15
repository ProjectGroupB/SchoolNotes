'use strict';

module.exports = {
  app: {
    title: 'School Notes Magazine',
    description: 'We make education fun! We equip parents with fun educational activities that encourage interaction with their children. Local teachers write our editorial.',
 //This interactions allows parents to gauge their child's academic progress. Local teachers write our editorial.
    keywords: 'family, parent, education, publication, reach, parents, mom, moms, dad, dads, community, advertise, art contest, legoland, kids, kid',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path for users
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    },
    imageUpload:{
      dest: './modules/artsubmissions/client/img/profile/uploads/', // Image upload destination path for artsubmissions
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
