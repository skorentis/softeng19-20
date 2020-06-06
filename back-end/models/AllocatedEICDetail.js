var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var AllocatedEICDetailSchema = new mongoose.Schema({
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
  MRID: {
    type: String
  },
  DocStatusValue: {
    type: String
  },
  AttributeInstanceComponent: {
    type: String
  },
  LongNames: {
    type: String
  },
  DisplayNames: {
    type: String
  },
  LastRequestDateAndOrTime: {
    type: String,
    default: ''
  },
  DeactivateRequestDateAndOrTime: {
    type: String,
    default: ''
  },
  MarketParticipantStreetAddressCountry: {
    type: String
  },
  MarketParticipantACERCode: {
    type: String
  },
  MarketParticipantVATcode: {
    type: String
  },
  Description: {
    type: String
  },
  EICParentMarketDocumentMRID: {
    type: String
  },
  ELCResponsibleMarketParticipantMRID: {
    type: String
  },
  IsDeleted: {
    type: String,
    required: true    
  },
  AllocatedEICID:{
    type: String,
    unique: true
  }
});

//priceSchema.plugin(mongoosePaginate);

var AllocatedEICDetail = mongoose.model('AllocatedEICDetail', AllocatedEICDetailSchema);

module.exports = {AllocatedEICDetail};