const expect = require('chai').expect;
const request = require('supertest');
const assert = require('assert')

const token = require('./tokens/auth_outofquotas-user_token.json');

const app = require('../app.js');


describe('Out of quotas', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return 402', (done) => {
    // let data = {
    //
    // }
    request(app)
    .get('/energy/api/ActualTotalLoad/Greece/PT60M/date/2018-1-1?format=json')
    .set('X-OBSERVATORY-AUTH', token.token)
    //.send(data
    .expect(402)
    .expect(res => {

    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });
  })
})
