'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Addvertise = mongoose.model('Addvertise'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  addvertise;

/**
 * Addvertise routes tests
 */
describe('Addvertise CRUD tests', function () {

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

    // Save a user to the test db and create new Addvertise
    user.save(function () {
      addvertise = {
        name: 'Addvertise name'
      };

      done();
    });
  });

  it('should be able to save a Addvertise if logged in', function (done) {
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

        // Save a new Addvertise
        agent.post('/api/addvertises')
          .send(addvertise)
          .expect(200)
          .end(function (addvertiseSaveErr, addvertiseSaveRes) {
            // Handle Addvertise save error
            if (addvertiseSaveErr) {
              return done(addvertiseSaveErr);
            }

            // Get a list of Addvertises
            agent.get('/api/addvertises')
              .end(function (addvertisesGetErr, addvertisesGetRes) {
                // Handle Addvertises save error
                if (addvertisesGetErr) {
                  return done(addvertisesGetErr);
                }

                // Get Addvertises list
                var addvertises = addvertisesGetRes.body;

                // Set assertions
                (addvertises[0].user._id).should.equal(userId);
                (addvertises[0].name).should.match('Addvertise name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Addvertise if not logged in', function (done) {
    agent.post('/api/addvertises')
      .send(addvertise)
      .expect(403)
      .end(function (addvertiseSaveErr, addvertiseSaveRes) {
        // Call the assertion callback
        done(addvertiseSaveErr);
      });
  });

  it('should not be able to save an Addvertise if no name is provided', function (done) {
    // Invalidate name field
    addvertise.name = '';

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

        // Save a new Addvertise
        agent.post('/api/addvertises')
          .send(addvertise)
          .expect(400)
          .end(function (addvertiseSaveErr, addvertiseSaveRes) {
            // Set message assertion
            (addvertiseSaveRes.body.message).should.match('Please fill Addvertise name');

            // Handle Addvertise save error
            done(addvertiseSaveErr);
          });
      });
  });

  it('should be able to update an Addvertise if signed in', function (done) {
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

        // Save a new Addvertise
        agent.post('/api/addvertises')
          .send(addvertise)
          .expect(200)
          .end(function (addvertiseSaveErr, addvertiseSaveRes) {
            // Handle Addvertise save error
            if (addvertiseSaveErr) {
              return done(addvertiseSaveErr);
            }

            // Update Addvertise name
            addvertise.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Addvertise
            agent.put('/api/addvertises/' + addvertiseSaveRes.body._id)
              .send(addvertise)
              .expect(200)
              .end(function (addvertiseUpdateErr, addvertiseUpdateRes) {
                // Handle Addvertise update error
                if (addvertiseUpdateErr) {
                  return done(addvertiseUpdateErr);
                }

                // Set assertions
                (addvertiseUpdateRes.body._id).should.equal(addvertiseSaveRes.body._id);
                (addvertiseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Addvertises if not signed in', function (done) {
    // Create new Addvertise model instance
    var addvertiseObj = new Addvertise(addvertise);

    // Save the addvertise
    addvertiseObj.save(function () {
      // Request Addvertises
      request(app).get('/api/addvertises')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Addvertise if not signed in', function (done) {
    // Create new Addvertise model instance
    var addvertiseObj = new Addvertise(addvertise);

    // Save the Addvertise
    addvertiseObj.save(function () {
      request(app).get('/api/addvertises/' + addvertiseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', addvertise.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Addvertise with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/addvertises/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Addvertise is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Addvertise which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Addvertise
    request(app).get('/api/addvertises/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Addvertise with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Addvertise if signed in', function (done) {
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

        // Save a new Addvertise
        agent.post('/api/addvertises')
          .send(addvertise)
          .expect(200)
          .end(function (addvertiseSaveErr, addvertiseSaveRes) {
            // Handle Addvertise save error
            if (addvertiseSaveErr) {
              return done(addvertiseSaveErr);
            }

            // Delete an existing Addvertise
            agent.delete('/api/addvertises/' + addvertiseSaveRes.body._id)
              .send(addvertise)
              .expect(200)
              .end(function (addvertiseDeleteErr, addvertiseDeleteRes) {
                // Handle addvertise error error
                if (addvertiseDeleteErr) {
                  return done(addvertiseDeleteErr);
                }

                // Set assertions
                (addvertiseDeleteRes.body._id).should.equal(addvertiseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Addvertise if not signed in', function (done) {
    // Set Addvertise user
    addvertise.user = user;

    // Create new Addvertise model instance
    var addvertiseObj = new Addvertise(addvertise);

    // Save the Addvertise
    addvertiseObj.save(function () {
      // Try deleting Addvertise
      request(app).delete('/api/addvertises/' + addvertiseObj._id)
        .expect(403)
        .end(function (addvertiseDeleteErr, addvertiseDeleteRes) {
          // Set message assertion
          (addvertiseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Addvertise error error
          done(addvertiseDeleteErr);
        });

    });
  });

  it('should be able to get a single Addvertise that has an orphaned user reference', function (done) {
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

          // Save a new Addvertise
          agent.post('/api/addvertises')
            .send(addvertise)
            .expect(200)
            .end(function (addvertiseSaveErr, addvertiseSaveRes) {
              // Handle Addvertise save error
              if (addvertiseSaveErr) {
                return done(addvertiseSaveErr);
              }

              // Set assertions on new Addvertise
              (addvertiseSaveRes.body.name).should.equal(addvertise.name);
              should.exist(addvertiseSaveRes.body.user);
              should.equal(addvertiseSaveRes.body.user._id, orphanId);

              // force the Addvertise to have an orphaned user reference
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

                    // Get the Addvertise
                    agent.get('/api/addvertises/' + addvertiseSaveRes.body._id)
                      .expect(200)
                      .end(function (addvertiseInfoErr, addvertiseInfoRes) {
                        // Handle Addvertise error
                        if (addvertiseInfoErr) {
                          return done(addvertiseInfoErr);
                        }

                        // Set assertions
                        (addvertiseInfoRes.body._id).should.equal(addvertiseSaveRes.body._id);
                        (addvertiseInfoRes.body.name).should.equal(addvertise.name);
                        should.equal(addvertiseInfoRes.body.user, undefined);

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
      Addvertise.remove().exec(done);
    });
  });
});
