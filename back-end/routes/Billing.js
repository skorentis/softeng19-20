const express = require('express');
const stripe = require('stripe')('sk_test_S7dz2LF5LSazgrz7L9yMWzf0001CPNDAzs');

const {User} = require('../models/User');

var baseURL = process.env.baseURL;
const router = express.Router();

function pay_success(packet_name, token, res) {
    if( packet_name === "50Q-1D"){
      User.findOne({token: token}).then((user) => {
        user.quota = user.quota + 50
        user.save().then((e) => {
          res.status(200).send({
            text: "Success"
          });
          console.log("Remaining Quotas: " + user.quota)
      })
      }, () => {
        res.status(404).send("No such user exists(wrong token)");
      }).catch((e) => {
        res.status(400).send(e);
      });
    }
    else if(packet_name==="100Q-LIMIT-1W"){
      User.findOne({token: token}).then((user) => {
        user.quota_limit = 100
        user.save().then((e) => {
          res.status(200).send({
            text: "Success"
          });
          console.log("New limit set to 100Q/Day")
      })
      }, () => {
        res.status(404).send("No such user exists(wrong token)");
      }).catch((e) => {
        res.status(400).send(e);
      });
    }
    else if(packet_name === "NO-LIMIT-1W"){
      User.findOne({token: token}).then((user) => {
        user.quota_limit = -1000000
        user.quota = -1000000
        user.save().then((e) => {
          res.status(200).send({
            text: "Success"
          });
          console.log("Unlimited quotas for the rest of the week")
      })
      }, () => {
        res.status(404).send("No such user exists(wrong token)");
      }).catch((e) => {
        res.status(400).send(e);
      });
    }
    else{
      res.status(400).send("Wrong Product?")
    }
}

//Billing Endpoints
router.post(`${baseURL}` + '/charge', (req, res) => {
  //get user data
  var tokenId = req.body.stripeTokenId;
  var packet_name = req.body.stripeName;
  var user_token = req.body.token;

  var temp = req.body.stripeAmount.split('.');
  var chargeAmount = parseInt(temp[0]) * 100 + parseInt(temp[1]);

  stripe.charges.create({
    amount: chargeAmount,
    source: tokenId,
    currency: "eur"
  })
  .then(function() {
      console.log("Success")
      pay_success(packet_name, user_token, res);
  })
  .catch(e => {
    console.log("Charge Fail");
    res.status(400).end();
    console.log(e)
  });
});



module.exports =  router;
