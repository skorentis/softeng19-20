var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var MapCodeSchema = new mongoose.Schema({
  Id:{
    type: String,
    required: true,
    unique: true
  },
  EntityCreatedAt: {
    type: String,
    required: true
  },
  EntityModifiedAt: {
    type: String,
    required: true
  },
  MapCodeText: {
    type: String
  },
  MapCodeNote: {
    type: String
  }
});

//priceSchema.plugin(mongoosePaginate);

var MapCode = mongoose.model('MapCode', MapCodeSchema);

module.exports = {MapCode};