var {User} = require('../models/User');
const jwt = require('jsonwebtoken');

var authenticate_admin = (req, res, next) => {
  // 'X-OBSERVATORY-AUTH' : 'Bearer <token-string>'
  var token = '' ;
  if(req.header('X-OBSERVATORY-AUTH')) {
    token = req.header('X-OBSERVATORY-AUTH').split(' ')[1];
  }
  if(!token || token === ""){
    return res.status(401).send("Not authorized");
  }

  User.findOne({token: token}).then((user) => {
    if (!user) {
      return Promise.reject("Not authorized");
    }

    if (user.permission != "admin")
    	return res.status(401).send("Not authorized");

    else { //admin
		  next();
    }
  }).catch((e) => {
    console.log(e)
    res.status(401).send(e);
  });
};

module.exports = {authenticate_admin};
