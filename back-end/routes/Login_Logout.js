const express = require('express');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');

var {authenticate} = require('../middleware/authenticate');
var {User} = require('../models/User');

var baseURL = process.env.baseURL;
const router = express.Router();



//Login & Logout Endpoints
router.post(`${baseURL}`+ '/Login', (req, res) =>{
  var username = req.body.username;
  var password = sha256(req.body.password + process.env.JWT_SECRET);
  User.findOne({username: username, password: password}).then((user) => {
    // if(user.token !== ""){
    //   return res.status(200).send("Already logged in")
    // }

    if (!user) {
      return res.status(404).json({
      	message: "No such user exists"
      });
    }

    var token = jwt.sign({code: user._id.toHexString()}, process.env.JWT_SECRET);
    // var token2 = jwt.sign({code: user._id.toHexString()}, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.token = token;
    user.save().then((e) => {
      res.status(200).json(
        {
          token: token,
        /* Extra response */
        //   expiresIn: 3600,
        //   userPermission: user.permission,
        //   quota: user.quota
        }
      );
    });
  }, () => {
    res.status(404).send("No such user exists");
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  });
});

router.post(`${baseURL}`+ '/Logout', authenticate, (req, res) =>{
  var token = '';
  if (req.header('X-OBSERVATORY-AUTH')) {
    token = req.header('X-OBSERVATORY-AUTH').split(' ')[1];
  }
  User.findOne({token: token}).then((user) => {
      if(user.permission === "admin"){
        return res.status(200).send();
      }
      user.token = "";
      user.quota = user.quota + 1;
      user.save().then((e) => {
        res.status(200).send();
    })
  }, () => {
    res.status(404).send("No such user exists(wrong token)");
  }).catch((e) => {
    res.status(400).send(e);
  });
});



module.exports =  router;
