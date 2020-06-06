var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var AggregatedGenerationPerTypeSchema = new mongoose.Schema({
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
  ActionTaskID: {
    type: String,
    required: true
  },
  Status: {
    type: String
  },
  Year: {
    type: String,
    required: true
  },
  Month: {
    type: String,
    required: true
  },
  Day: {
    type: String,
    required: true
  },
  DateTime: {
    type: String,
    required: true
  },
  AreaName: {
    type: String
  }, 
  UpdateTime: {
    type: String,
    required: true
  },
  ActualGenerationOutput: {
    type: Number,
    required: true
  },
  ActualConsuption: {
    type: String,
    required: true
  },
  AreaTypeCodeId: {
    type: String
  },
  ProductionTypeId: {
    type: String
  },
  ResolutionCodeId: {
    type: String
  },
  MapCodeId: {
    type: String
  },
  AreaCodeId: {
    type: String,
    required: true
  },
  RowHash: {
    type: String,
    required: false
  }
});

//priceSchema.plugin(mongoosePaginate);

var AggregatedGenerationPerType = mongoose.model('AggregatedGenerationPerType', AggregatedGenerationPerTypeSchema);

module.exports = {AggregatedGenerationPerType};