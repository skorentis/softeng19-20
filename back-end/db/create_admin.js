var {User} = require('../models/User');

var new_user = new User({
    username: "admin",
    password: "321nimda",
    permission: "admin",
    token: "adminstokestring",
    quota: 0
});

new_user.save().then((doc) => {
	// console.log(doc);
}, (e) => {
    console.log(e);
});
