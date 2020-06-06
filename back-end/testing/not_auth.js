const expect = require('chai').expect;
const request = require('supertest');
const assert = require('assert')

const app = require('../app.js');

describe('Not auth - no token', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return 401 not auth', (done) => {
    // let data = {
    //
    // }
    request(app)
    .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-1-1?format=json')
    //.send(data
    .expect(401)
    .expect(res => {
          expect(res.body).to.exist
    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });
  })
})

describe('Not auth - wrong token', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return 401 not auth', (done) => {
    // let data = {
    //
    // }
    request(app)
    .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-1-1?format=json')
    //.send(data
    .set('X-OBSERVATORY-AUTH', '000')
    .expect(401)
    .expect(res => {
          expect(res.body).to.exist
    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });
  })
})
