var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var ProductionTypeSchema = new mongoose.Schema({
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
  ProductionTypeText: {
    type: String
  },
  ProductionTypeNote: {
    type: String
  }
});

//priceSchema.plugin(mongoosePaginate);

var ProductionType = mongoose.model('ProductionType', ProductionTypeSchema);

module.exports = {ProductionType};