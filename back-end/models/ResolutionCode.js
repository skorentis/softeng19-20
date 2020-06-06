var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var ResolutionCodeSchema = new mongoose.Schema({
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
  ResolutionCodeText: {
    type: String
  },
  ResolutionCodeNote: {
    type: String
  }
});

//priceSchema.plugin(mongoosePaginate);

var ResolutionCode = mongoose.model('ResolutionCode', ResolutionCodeSchema);

module.exports = {ResolutionCode};