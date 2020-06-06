var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var DayAheadTotalLoadForecastSchema = new mongoose.Schema({
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
  TotalLoadValue: {
    type: Number,
    required: true
  },
  AreaTypeCodeId: {
    type: String
  },
  MapCodeId: {
    type: String
  },
  ResolutionCodeId: {
    type: String
  },
  AreaCodeId: {
    type: String,
    required: true
  },
  RowHash: {
    type: String
  }
});

//priceSchema.plugin(mongoosePaginate);

var DayAheadTotalLoadForecast = mongoose.model('DayAheadTotalLoadForecast', DayAheadTotalLoadForecastSchema);

module.exports = {DayAheadTotalLoadForecast};