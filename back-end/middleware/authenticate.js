var {User} = require('../models/User');

var authenticate = (req, res, next) => {
  var token = '' ;
  if(req.header('X-OBSERVATORY-AUTH')) {
    token = req.header('X-OBSERVATORY-AUTH').split(' ')[1];
  }
  if(!token || token === ""){
    console.log('no token')
    return res.status(401).send("Not authorized");
  }

  User.findOne({token: token}).then((user) => {
    if (!user) {
      console.log('no user')
      return Promise.reject("Not authorized");
    }


    if(user.permission == "user"){
      User.findOneAndUpdate({ username: user.username, password: user.password, token: token }, { $inc: { "quota": -1 } }).then((beforeUpdateUser) => {
        if(beforeUpdateUser.quota <= -1000000){
          //unlimited_quotas
          next();
        }
        else if(beforeUpdateUser.quota <= 0 ){
          user.quota = 0;
          user.save().then((e) => {
            //next();
          })
          return res.status(402).send("Out of quota");
        }
        else
          next();
      })
    }
    // if(user.permission == "user"){
    //   if(user.quota < 0){
    //     //unlimited_quotas
    //     next();
    //   }
    //   else if(user.quota == 0){
    //     //out of quotas
    //     return res.status(402).send(
    //       {message: `Sorry, you are out of quotas. Go to 'Shop' section to buy some more, or wait until the end of the day, when your quotas will be restored.`}
    //       );
    //   }
    //   else{
    //     user.quota = user.quota - 1
    //     user.save().then((e) => {
    //       next();
    //     })
    //   }
    // }
		else {
      //admin
		  next();
    }
  }).catch((e) => {
    console.log('error_catch')
    res.status(401).send(e);
  });
};

module.exports = {authenticate};
