const express = require('express');

var {Packet} = require('../models/Packet.js');

var baseURL = process.env.baseURL;
const router = express.Router();



//Get Packet Endpoint
router.get(`${baseURL}` + '/getpackets', (req,res) => {
  Packet.find({}).then( packets => {
    var packet_list = [];
    packets.forEach((item, i) => {
      packet_list.push({
        name: item.name,
        description: item.description,
        price: item.price
      })
    });
    res.send(packet_list) ;
  }).catch((e) => {
      res.status(400).send(e);
      console.log(e);
    });
})



module.exports =  router;
