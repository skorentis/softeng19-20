const expect = require('chai').expect;
const request = require('supertest');
const assert = require('assert')

const app = require('../app.js');
const exp_res = require('./expected_responses/aggregated_month.json')
const token = require('./tokens/auth_token_admin.json');

describe('2b', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return status code : 200, aggregated_perday_obj', (done) => {
    // let data = {
    //
    // }
    request(app)
    .get('/energy/api/AggregatedGenerationPerType/Greece/{Fossil Gas}/PT60M/month/2018-1?format=json')
    //.send(data
    .set('X-OBSERVATORY-AUTH', token.token)
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
