var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var AreaTypeCodeSchema = new mongoose.Schema({
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
  AreaTypeCodeText: {
    type: String
  },
  AreaTypeCodeNote: {
    type: String
  }
});

//priceSchema.plugin(mongoosePaginate);

var AreaTypeCode = mongoose.model('AreaTypeCode', AreaTypeCodeSchema);

module.exports = {AreaTypeCode};