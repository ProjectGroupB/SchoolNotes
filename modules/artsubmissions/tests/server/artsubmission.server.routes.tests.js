'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Artsubmission = mongoose.model('Artsubmission'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  artsubmission;

/**
 * Artsubmission routes tests
 */
describe('Artsubmission CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Artsubmission
    user.save(function () {
      artsubmission = {
        name: 'Artsubmission name'
      };

      done();
    });
  });

  it('should be able to save a Artsubmission if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Artsubmission
        agent.post('/api/artsubmissions')
          .send(artsubmission)
          .expect(200)
          .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
            // Handle Artsubmission save error
            if (artsubmissionSaveErr) {
              return done(artsubmissionSaveErr);
            }

            // Get a list of Artsubmissions
            agent.get('/api/artsubmissions')
              .end(function (artsubmissionsGetErr, artsubmissionsGetRes) {
                // Handle Artsubmissions save error
                if (artsubmissionsGetErr) {
                  return done(artsubmissionsGetErr);
                }

                // Get Artsubmissions list
                var artsubmissions = artsubmissionsGetRes.body;

                // Set assertions
                (artsubmissions[0].user._id).should.equal(userId);
                (artsubmissions[0].name).should.match('Artsubmission name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Artsubmission if not logged in', function (done) {
    agent.post('/api/artsubmissions')
      .send(artsubmission)
      .expect(403)
      .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
        // Call the assertion callback
        done(artsubmissionSaveErr);
      });
  });

  it('should not be able to save an Artsubmission if no name is provided', function (done) {
    // Invalidate name field
    artsubmission.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Artsubmission
        agent.post('/api/artsubmissions')
          .send(artsubmission)
          .expect(400)
          .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
            // Set message assertion
            (artsubmissionSaveRes.body.message).should.match('Please fill Artsubmission name');

            // Handle Artsubmission save error
            done(artsubmissionSaveErr);
          });
      });
  });

  it('should be able to update an Artsubmission if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Artsubmission
        agent.post('/api/artsubmissions')
          .send(artsubmission)
          .expect(200)
          .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
            // Handle Artsubmission save error
            if (artsubmissionSaveErr) {
              return done(artsubmissionSaveErr);
            }

            // Update Artsubmission name
            artsubmission.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Artsubmission
            agent.put('/api/artsubmissions/' + artsubmissionSaveRes.body._id)
              .send(artsubmission)
              .expect(200)
              .end(function (artsubmissionUpdateErr, artsubmissionUpdateRes) {
                // Handle Artsubmission update error
                if (artsubmissionUpdateErr) {
                  return done(artsubmissionUpdateErr);
                }

                // Set assertions
                (artsubmissionUpdateRes.body._id).should.equal(artsubmissionSaveRes.body._id);
                (artsubmissionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Artsubmissions if not signed in', function (done) {
    // Create new Artsubmission model instance
    var artsubmissionObj = new Artsubmission(artsubmission);

    // Save the artsubmission
    artsubmissionObj.save(function () {
      // Request Artsubmissions
      request(app).get('/api/artsubmissions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Artsubmission if not signed in', function (done) {
    // Create new Artsubmission model instance
    var artsubmissionObj = new Artsubmission(artsubmission);

    // Save the Artsubmission
    artsubmissionObj.save(function () {
      request(app).get('/api/artsubmissions/' + artsubmissionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', artsubmission.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Artsubmission with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/artsubmissions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Artsubmission is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Artsubmission which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Artsubmission
    request(app).get('/api/artsubmissions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Artsubmission with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Artsubmission if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Artsubmission
        agent.post('/api/artsubmissions')
          .send(artsubmission)
          .expect(200)
          .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
            // Handle Artsubmission save error
            if (artsubmissionSaveErr) {
              return done(artsubmissionSaveErr);
            }

            // Delete an existing Artsubmission
            agent.delete('/api/artsubmissions/' + artsubmissionSaveRes.body._id)
              .send(artsubmission)
              .expect(200)
              .end(function (artsubmissionDeleteErr, artsubmissionDeleteRes) {
                // Handle artsubmission error error
                if (artsubmissionDeleteErr) {
                  return done(artsubmissionDeleteErr);
                }

                // Set assertions
                (artsubmissionDeleteRes.body._id).should.equal(artsubmissionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Artsubmission if not signed in', function (done) {
    // Set Artsubmission user
    artsubmission.user = user;

    // Create new Artsubmission model instance
    var artsubmissionObj = new Artsubmission(artsubmission);

    // Save the Artsubmission
    artsubmissionObj.save(function () {
      // Try deleting Artsubmission
      request(app).delete('/api/artsubmissions/' + artsubmissionObj._id)
        .expect(403)
        .end(function (artsubmissionDeleteErr, artsubmissionDeleteRes) {
          // Set message assertion
          (artsubmissionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Artsubmission error error
          done(artsubmissionDeleteErr);
        });

    });
  });

  it('should be able to get a single Artsubmission that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Artsubmission
          agent.post('/api/artsubmissions')
            .send(artsubmission)
            .expect(200)
            .end(function (artsubmissionSaveErr, artsubmissionSaveRes) {
              // Handle Artsubmission save error
              if (artsubmissionSaveErr) {
                return done(artsubmissionSaveErr);
              }

              // Set assertions on new Artsubmission
              (artsubmissionSaveRes.body.name).should.equal(artsubmission.name);
              should.exist(artsubmissionSaveRes.body.user);
              should.equal(artsubmissionSaveRes.body.user._id, orphanId);

              // force the Artsubmission to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Artsubmission
                    agent.get('/api/artsubmissions/' + artsubmissionSaveRes.body._id)
                      .expect(200)
                      .end(function (artsubmissionInfoErr, artsubmissionInfoRes) {
                        // Handle Artsubmission error
                        if (artsubmissionInfoErr) {
                          return done(artsubmissionInfoErr);
                        }

                        // Set assertions
                        (artsubmissionInfoRes.body._id).should.equal(artsubmissionSaveRes.body._id);
                        (artsubmissionInfoRes.body.name).should.equal(artsubmission.name);
                        should.equal(artsubmissionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Artsubmission.remove().exec(done);
    });
  });
});
