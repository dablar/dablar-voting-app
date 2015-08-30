'use strict';

var app = require('../../app');
var Poll = require('./poll.model');
var User = require('../user/user.model');
var request = require('supertest');

var newPoll;

describe('Poll API:', function() {
  var user;
  var token; // need to be auth

  // Clear users before testing
  before(function() {
    return User.removeAsync().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });

      return user.saveAsync();
    });
  });

  // Auth before every request
  beforeEach(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });


  // Clear users and polls after testing
  after(function() {    
    return User.removeAsync().then(Poll.removeAsync());
  });


  describe('GET /api/polls', function() {
    var polls;

    beforeEach(function(done) {
      request(app)
        .get('/api/polls')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          polls = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      polls.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/polls', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/polls')
        .set('authorization', 'Bearer ' + token)
        .send({
              question: 'New poll',
              author: user._id,
              pollOptions: [ { optionText: 'new option 1' , votes: 0 }, { optionText:'new option 2', votes: 0}]
            }
          )
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newPoll = res.body;
          done();
        });
    });

    it('should respond with the newly created poll', function() {
      newPoll.question.should.equal('New poll');
      newPoll.pollOptions.length.should.equal(2);
    });

  });

  describe('GET /api/polls/:id', function() {
    var poll;

    beforeEach(function(done) {
      request(app)
        .get('/api/polls/' + newPoll._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          poll = res.body;
          done();
        });
    });

    afterEach(function() {
      poll = {};
    });

    it('should respond with the requested poll', function() {
      newPoll.question.should.equal('New poll');
      newPoll.pollOptions.length.should.equal(2);
    });

  });

  describe('PUT /api/polls/:id', function() {
    var updatedPoll

    beforeEach(function(done) {
      request(app)
        .put('/api/polls/' + newPoll._id)
        .set('authorization', 'Bearer ' + token)
        .send({
              question: 'Updated poll',
              author: user._id,
              pollOptions: [ { optionText:'new option 3', votes: 3}]
            })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPoll = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPoll = {};
    });

    it('should respond with the updated poll', function() {
      updatedPoll.question.should.equal('Updated poll');
      updatedPoll.pollOptions.length.should.equal(1);
    });

  });

  describe('DELETE /api/polls/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/polls/' + newPoll._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when poll does not exist', function(done) {
      request(app)
        .delete('/api/polls/' + newPoll._id)
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
