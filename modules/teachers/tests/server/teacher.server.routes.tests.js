'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Teacher = mongoose.model('Teacher'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  teacher;

/**
 * Teacher routes tests
 */
describe('Teacher CRUD tests', function () {

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

    // Save a user to the test db and create new Teacher
    user.save(function () {
      teacher = {
        name: 'Teacher name'
      };

      done();
    });
  });

  it('should be able to save a Teacher if logged in', function (done) {
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

        // Save a new Teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle Teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Get a list of Teachers
            agent.get('/api/teachers')
              .end(function (teachersGetErr, teachersGetRes) {
                // Handle Teachers save error
                if (teachersGetErr) {
                  return done(teachersGetErr);
                }

                // Get Teachers list
                var teachers = teachersGetRes.body;

                // Set assertions
                (teachers[0].user._id).should.equal(userId);
                (teachers[0].name).should.match('Teacher name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Teacher if not logged in', function (done) {
    agent.post('/api/teachers')
      .send(teacher)
      .expect(403)
      .end(function (teacherSaveErr, teacherSaveRes) {
        // Call the assertion callback
        done(teacherSaveErr);
      });
  });

  it('should not be able to save an Teacher if no name is provided', function (done) {
    // Invalidate name field
    teacher.name = '';

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

        // Save a new Teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(400)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Set message assertion
            (teacherSaveRes.body.message).should.match('Please fill Teacher name');

            // Handle Teacher save error
            done(teacherSaveErr);
          });
      });
  });

  it('should be able to update an Teacher if signed in', function (done) {
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

        // Save a new Teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle Teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Update Teacher name
            teacher.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Teacher
            agent.put('/api/teachers/' + teacherSaveRes.body._id)
              .send(teacher)
              .expect(200)
              .end(function (teacherUpdateErr, teacherUpdateRes) {
                // Handle Teacher update error
                if (teacherUpdateErr) {
                  return done(teacherUpdateErr);
                }

                // Set assertions
                (teacherUpdateRes.body._id).should.equal(teacherSaveRes.body._id);
                (teacherUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Teachers if not signed in', function (done) {
    // Create new Teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the teacher
    teacherObj.save(function () {
      // Request Teachers
      request(app).get('/api/teachers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Teacher if not signed in', function (done) {
    // Create new Teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the Teacher
    teacherObj.save(function () {
      request(app).get('/api/teachers/' + teacherObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', teacher.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Teacher with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/teachers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Teacher is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Teacher which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Teacher
    request(app).get('/api/teachers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Teacher with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Teacher if signed in', function (done) {
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

        // Save a new Teacher
        agent.post('/api/teachers')
          .send(teacher)
          .expect(200)
          .end(function (teacherSaveErr, teacherSaveRes) {
            // Handle Teacher save error
            if (teacherSaveErr) {
              return done(teacherSaveErr);
            }

            // Delete an existing Teacher
            agent.delete('/api/teachers/' + teacherSaveRes.body._id)
              .send(teacher)
              .expect(200)
              .end(function (teacherDeleteErr, teacherDeleteRes) {
                // Handle teacher error error
                if (teacherDeleteErr) {
                  return done(teacherDeleteErr);
                }

                // Set assertions
                (teacherDeleteRes.body._id).should.equal(teacherSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Teacher if not signed in', function (done) {
    // Set Teacher user
    teacher.user = user;

    // Create new Teacher model instance
    var teacherObj = new Teacher(teacher);

    // Save the Teacher
    teacherObj.save(function () {
      // Try deleting Teacher
      request(app).delete('/api/teachers/' + teacherObj._id)
        .expect(403)
        .end(function (teacherDeleteErr, teacherDeleteRes) {
          // Set message assertion
          (teacherDeleteRes.body.message).should.match('User is not authorized');

          // Handle Teacher error error
          done(teacherDeleteErr);
        });

    });
  });

  it('should be able to get a single Teacher that has an orphaned user reference', function (done) {
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

          // Save a new Teacher
          agent.post('/api/teachers')
            .send(teacher)
            .expect(200)
            .end(function (teacherSaveErr, teacherSaveRes) {
              // Handle Teacher save error
              if (teacherSaveErr) {
                return done(teacherSaveErr);
              }

              // Set assertions on new Teacher
              (teacherSaveRes.body.name).should.equal(teacher.name);
              should.exist(teacherSaveRes.body.user);
              should.equal(teacherSaveRes.body.user._id, orphanId);

              // force the Teacher to have an orphaned user reference
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

                    // Get the Teacher
                    agent.get('/api/teachers/' + teacherSaveRes.body._id)
                      .expect(200)
                      .end(function (teacherInfoErr, teacherInfoRes) {
                        // Handle Teacher error
                        if (teacherInfoErr) {
                          return done(teacherInfoErr);
                        }

                        // Set assertions
                        (teacherInfoRes.body._id).should.equal(teacherSaveRes.body._id);
                        (teacherInfoRes.body.name).should.equal(teacher.name);
                        should.equal(teacherInfoRes.body.user, undefined);

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
      Teacher.remove().exec(done);
    });
  });
});
