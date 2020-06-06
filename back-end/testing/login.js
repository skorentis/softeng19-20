const expect = require('chai').expect;
const request = require('supertest');
const { assert } = require('chai')
const fs = require('fs');

const app = require('../app.js');
const creds = require('./login_creds/login_user.json');
// const exp_res = {
//     "status": "OK"
// } ;

var export_token = '';

//login
describe('Login', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return token', (done) => {
    // let data = {
    //
    // }
    request(app)
    .post('/energy/api/Login')
    .send(creds)
    //.send(data
    .expect(200)
    .expect(res => {
          assert.property(res.body, 'token')
          export_token = res.body.token
    })
    .end(function(err, res) {
        if (err) return done(err);
        fs.writeFileSync('./testing/tokens/auth_login_user_token.json', export_token, 'utf8');
        done();
    });
  })
})
