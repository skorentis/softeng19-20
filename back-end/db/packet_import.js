require('../db/mongoose');

var {Packet} = require('../models/Packet.js');

var new_packet = new Packet({
  name: "50Q-1D",
  description: "+50 Quotas for the rest of the day",
  price: "9.99"
  });

var new_packet1 = new Packet({
  name: "100Q-LIMIT-1W",
  description: "100Q Per Day for the rest of the week",
  price: "49.99"
  });

var new_packet2 = new Packet({
  name: "NO-LIMIT-1W",
  description: "Unlimited Quotas for the rest of the week",
  price: "99.99"
  });

new_packet.save().then((doc) => {
  new_packet1.save().then((doc1) => {
    new_packet2.save().then((doc2) => {
      console.log('Packets saved in db')
    }, (e) => {
      console.log(e);
    })
  }, (e) => {
    console.log(e);
  });
}, (e) => {
  console.log(e);
}).catch( e => {
  console.log(e);
})
