const expect = require('chai').expect;
const request = require('supertest');
const { assert } = require('chai')
const fs = require('fs');

const app = require('../app.js');
// const exp_res = {
//     "status": "OK"
// } ;

var export_token = '';

//logout
describe('Logout', () => {
  // after((done) => {
  //   done()
  // })
  it('Should return empty body...', (done) => {
    // let data = {
    //
    // }
    export_token = fs.readFileSync('./testing/tokens/auth_login_user_token.json', 'utf8').split(' ')[0];
    request(app)
    .post('/energy/api/Logout')
    .set('X-OBSERVATORY-AUTH', 'Bearer ' + export_token)
    //.send(data
    .expect(200)
    .expect(res => {
          expect(res.body).to.be.empty;
    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });
  })
})
