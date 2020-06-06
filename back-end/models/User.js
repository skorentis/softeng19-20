var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    default: "user",
    enum:["user", "admin"]
  },
  email: {
    type: String,
  },
  quota:{
    type: Number,
    required: true,
    default: 50
  },
  quota_limit:{
    type: Number,
    required: true,
    default: 50
  },
  token:{
    type: String,
    default: ""
  }
});

//priceSchema.plugin(mongoosePaginate);

var User = mongoose.model('User', UserSchema);

module.exports = {User};
