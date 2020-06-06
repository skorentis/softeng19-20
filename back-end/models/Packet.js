var mongoose = require('mongoose');
//var mongoosePaginate = require('mongoose-paginate');

var PacketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum:["50Q-1D", "100Q-LIMIT-1W", "NO-LIMIT-1W"]
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

//priceSchema.plugin(mongoosePaginate);

var Packet = mongoose.model('Packet', PacketSchema);

module.exports = {Packet};
