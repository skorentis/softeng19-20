const expect = require('chai').expect;
const request = require('supertest');
const assert = require('assert')

const app = require('../app.js');
const exp_res = {
    "status": "OK"
} ;

describe('HealthCheck', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return status: OK', (done) => {
    // let data = {
    //
    // }
    request(app)
    .get('/energy/api/HealthCheck')
    //.send(data
    .expect(200)
    .expect(res => {
          expect(res.body).to.eql(exp_res)
    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });
  })
})
