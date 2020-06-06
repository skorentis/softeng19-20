require('../db/mongoose');

const cron = require('node-cron');

var {User} = require('../models/User');

var default_quota_val = process.env.default_quota_val;

cron.schedule('0 0 * * *', () => {
  //renew users' quota
  User.find({permission: "user"}).then( (users) => {
  	users.forEach(user => {
  		user.quota = user.quota_limit;
  		user.save().then((e) => {
  			//
    	}, (e) => {
      		console.log('error cron sched1: '+ e);
    	})
  	})
    if(users.length > 0){
      console.log("users' quotas set to quota_limit");
    }
  }, (e) => {
      console.log(e);
  }).catch((e) => {
      console.log(e);
  	});
});

cron.schedule('0 0 * * 0', () => {
  //renew users' quota
  User.find({permission: "user"}).then( (users) => {
    users.forEach(user => {
      user.quota_limit = default_quota_val;
      user.quota = default_quota_val;
      user.save().then((e) => {
        //
      }, (e) => {
          console.log('error cron sched2: '+ e);
      })
    })
    if(users.length > 0){
      console.log("users' quotas set to default value: " + default_quota_val);
    }
  }, (e) => {
      console.log(e);
  }).catch((e) => {
      console.log(e);
    });
});