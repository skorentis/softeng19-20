//const expect = require('chai').expect;
const request = require('supertest');
const {assert} = require('chai')
const token = require('./tokens/auth_token_admin.json');
var {User} = require('../models/User');

const app = require('../app.js');
const exp_res = {
    "status": "OK"
} ;

describe('Create user', () => {
  // after((done) => {
  //   done()
  // })

  it('Should return user-obj', (done) => {
    // let data = {
    //
    // }
    request(app)
    .post('/energy/api/Admin/users')
    //.send(data
    .expect(200)
    .send({
      username: "test_user",
      password: "1234"
    })
    .set('X-OBSERVATORY-AUTH', token.token)
    .expect(res => {
          assert.property(res.body, "newUser");
          assert.property(res.body, "newDoc");
    })
    .end(function(err, res) {
        if (err) return done(err);
        done();
    });

    after((done) => {
      User.collection.deleteMany({username: "test_user"})
      .catch((err) => {
        console.log(err)
      })
      done()
    })
  })
})
