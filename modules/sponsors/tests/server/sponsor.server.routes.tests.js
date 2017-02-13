'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sponsor = mongoose.model('Sponsor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sponsor;

/**
 * Sponsor routes tests
 */
describe('Sponsor CRUD tests', function () {

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

    // Save a user to the test db and create new Sponsor
    user.save(function () {
      sponsor = {
        name: 'Sponsor name'
      };

      done();
    });
  });

  it('should be able to save a Sponsor if logged in', function (done) {
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

        // Save a new Sponsor
        agent.post('/api/sponsors')
          .send(sponsor)
          .expect(200)
          .end(function (sponsorSaveErr, sponsorSaveRes) {
            // Handle Sponsor save error
            if (sponsorSaveErr) {
              return done(sponsorSaveErr);
            }

            // Get a list of Sponsors
            agent.get('/api/sponsors')
              .end(function (sponsorsGetErr, sponsorsGetRes) {
                // Handle Sponsors save error
                if (sponsorsGetErr) {
                  return done(sponsorsGetErr);
                }

                // Get Sponsors list
                var sponsors = sponsorsGetRes.body;

                // Set assertions
                (sponsors[0].user._id).should.equal(userId);
                (sponsors[0].name).should.match('Sponsor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sponsor if not logged in', function (done) {
    agent.post('/api/sponsors')
      .send(sponsor)
      .expect(403)
      .end(function (sponsorSaveErr, sponsorSaveRes) {
        // Call the assertion callback
        done(sponsorSaveErr);
      });
  });

  it('should not be able to save an Sponsor if no name is provided', function (done) {
    // Invalidate name field
    sponsor.name = '';

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

        // Save a new Sponsor
        agent.post('/api/sponsors')
          .send(sponsor)
          .expect(400)
          .end(function (sponsorSaveErr, sponsorSaveRes) {
            // Set message assertion
            (sponsorSaveRes.body.message).should.match('Please fill Sponsor name');

            // Handle Sponsor save error
            done(sponsorSaveErr);
          });
      });
  });

  it('should be able to update an Sponsor if signed in', function (done) {
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

        // Save a new Sponsor
        agent.post('/api/sponsors')
          .send(sponsor)
          .expect(200)
          .end(function (sponsorSaveErr, sponsorSaveRes) {
            // Handle Sponsor save error
            if (sponsorSaveErr) {
              return done(sponsorSaveErr);
            }

            // Update Sponsor name
            sponsor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sponsor
            agent.put('/api/sponsors/' + sponsorSaveRes.body._id)
              .send(sponsor)
              .expect(200)
              .end(function (sponsorUpdateErr, sponsorUpdateRes) {
                // Handle Sponsor update error
                if (sponsorUpdateErr) {
                  return done(sponsorUpdateErr);
                }

                // Set assertions
                (sponsorUpdateRes.body._id).should.equal(sponsorSaveRes.body._id);
                (sponsorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sponsors if not signed in', function (done) {
    // Create new Sponsor model instance
    var sponsorObj = new Sponsor(sponsor);

    // Save the sponsor
    sponsorObj.save(function () {
      // Request Sponsors
      request(app).get('/api/sponsors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sponsor if not signed in', function (done) {
    // Create new Sponsor model instance
    var sponsorObj = new Sponsor(sponsor);

    // Save the Sponsor
    sponsorObj.save(function () {
      request(app).get('/api/sponsors/' + sponsorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sponsor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sponsor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sponsors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sponsor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sponsor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sponsor
    request(app).get('/api/sponsors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sponsor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sponsor if signed in', function (done) {
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

        // Save a new Sponsor
        agent.post('/api/sponsors')
          .send(sponsor)
          .expect(200)
          .end(function (sponsorSaveErr, sponsorSaveRes) {
            // Handle Sponsor save error
            if (sponsorSaveErr) {
              return done(sponsorSaveErr);
            }

            // Delete an existing Sponsor
            agent.delete('/api/sponsors/' + sponsorSaveRes.body._id)
              .send(sponsor)
              .expect(200)
              .end(function (sponsorDeleteErr, sponsorDeleteRes) {
                // Handle sponsor error error
                if (sponsorDeleteErr) {
                  return done(sponsorDeleteErr);
                }

                // Set assertions
                (sponsorDeleteRes.body._id).should.equal(sponsorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sponsor if not signed in', function (done) {
    // Set Sponsor user
    sponsor.user = user;

    // Create new Sponsor model instance
    var sponsorObj = new Sponsor(sponsor);

    // Save the Sponsor
    sponsorObj.save(function () {
      // Try deleting Sponsor
      request(app).delete('/api/sponsors/' + sponsorObj._id)
        .expect(403)
        .end(function (sponsorDeleteErr, sponsorDeleteRes) {
          // Set message assertion
          (sponsorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sponsor error error
          done(sponsorDeleteErr);
        });

    });
  });

  it('should be able to get a single Sponsor that has an orphaned user reference', function (done) {
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

          // Save a new Sponsor
          agent.post('/api/sponsors')
            .send(sponsor)
            .expect(200)
            .end(function (sponsorSaveErr, sponsorSaveRes) {
              // Handle Sponsor save error
              if (sponsorSaveErr) {
                return done(sponsorSaveErr);
              }

              // Set assertions on new Sponsor
              (sponsorSaveRes.body.name).should.equal(sponsor.name);
              should.exist(sponsorSaveRes.body.user);
              should.equal(sponsorSaveRes.body.user._id, orphanId);

              // force the Sponsor to have an orphaned user reference
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

                    // Get the Sponsor
                    agent.get('/api/sponsors/' + sponsorSaveRes.body._id)
                      .expect(200)
                      .end(function (sponsorInfoErr, sponsorInfoRes) {
                        // Handle Sponsor error
                        if (sponsorInfoErr) {
                          return done(sponsorInfoErr);
                        }

                        // Set assertions
                        (sponsorInfoRes.body._id).should.equal(sponsorSaveRes.body._id);
                        (sponsorInfoRes.body.name).should.equal(sponsor.name);
                        should.equal(sponsorInfoRes.body.user, undefined);

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
      Sponsor.remove().exec(done);
    });
  });
});
