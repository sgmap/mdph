'use strict';

var should = require('should');
var Request = require('./request.model');
var controller = require('./request.controller');
var User = require('../user/user.model');

import startServer from '../../test/utils/server';

describe('Request Integration', function() {

  var api;
  var token;
  var testUser;
  var server;

  before(done => {
    startServer((result) => {
      server = result.server;
      api = result.api;
      token = result.token;
      testUser = result.fakeUser;
      done();
    });
  });

  after(done => {
    server.close();
    done();
  });

  describe('Get single Request', function() {
    beforeEach(done => {
      var newRequest = new Request({
        shortId: '1234',
        prestations: ['AAH'],
        renouvellements: ['PCH'],
        documents: [{
          type: 'carteIdentite',
          originalname: 'carte-identite.jpg',
          filename: 'hashed-carte-identite',
          mimetype: 'image/jpeg'
        }],
        user: testUser._id
      });

      newRequest.save(done);
    });

    afterEach(done => {
      Request.remove().exec(done);
    });

    it('should get the specified populated request', done => {
      var gettedRequest;

      api
        .get(`/api/requests/1234?access_token=${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          gettedRequest = res.body;
          gettedRequest.should.have.property('detailPrestations');
          gettedRequest.should.have.property('detailRenouvellements');
          gettedRequest.should.have.property('documents');
          gettedRequest.documents.should.have.property('obligatoires');
          done();
        });
    });
  });

  describe('Update Request', function() {

    beforeEach(done => {
      var newRequest = new Request({ shortId: '1234', user: testUser._id });
      newRequest.save(done);
    });

    afterEach(done => {
      Request.remove().exec(done);
    });

    describe('When the user is authenticated', function() {
      describe('When the request exist', function() {
        it('should respond with the updated thing', done => {
          var updatedRequest;

          api
            .put('/api/requests/1234?access_token=' + token)
            .send({
              mdph: 'updatedMDPH'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }

              updatedRequest = res.body;
              updatedRequest.mdph.should.equal('updatedMDPH');
              done();
            });
        });

      });

      describe('When the request does not exist', function() {
        it('should return 404', done => {
          api
            .put(`/api/requests/9876?access_token=${token}`)
            .send({
              mdph: 'updatedMDPH'
            })
            .expect(404, done);
        });
      });

    });

    describe('When the user is not authenticated', function() {
      it('should return 401', done => {
        //given
        var newRequest = new Request({ shortId: '1234', user: testUser._id });

        //when
        newRequest.save(function() {
          //then
          api
            .put('/api/requests/1234')
            .expect(401, done);
        });
      });
    });

  });

  describe('Delete Documents', function() {
    describe('When the request is en cours', function() {
      var idDoc;

      //initialize a request
      beforeEach(done => {
        var newDocument = {
          type: 'carteIdentite'
        };

        var newRequest = new Request({
          shortId: '1234',
          status: 'en_cours',
          documents: [newDocument],
          user: testUser._id
        });

        newRequest.save(function(err, request) {
          if (err) {
            return done(err);
          }

          idDoc = request.documents[0]._id;
          done();
        });
      });

      afterEach(done => {
        //clear mdphs after testing
        Request.remove().exec(done);
      });

      it('should return 204', done => {
        api
          .delete('/api/requests/1234/document/' + idDoc + '?access_token=' + token)
          .expect(204, done);
      });
    });
  });
});
