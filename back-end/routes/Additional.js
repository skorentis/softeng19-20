const express = require('express');

var {mongoose} = require('../db/mongoose');
var {ActualTotalLoad} = require('../models/ActualTotalLoad');
var {AggregatedGenerationPerType} = require('../models/AggregatedGenerationPerType');
var {AllocatedEICDetail} = require('../models/AllocatedEICDetail');
var {AreaTypeCode} = require('../models/AreaTypeCode');
var {DayAheadTotalLoadForecast} = require('../models/DayAheadTotalLoadForecast');
var {MapCode} = require('../models/MapCode');
var {ProductionType} = require('../models/ProductionType');
var {ResolutionCode} = require('../models/ResolutionCode');
var {User} = require('../models/User');

var baseURL = process.env.baseURL;
const router = express.Router();



//Additional Endpoints
router.get(`${baseURL}`+ '/HealthCheck', (req, res) =>{
  if(mongoose.connection.readyState == 1)
    return res.send({
      status: "OK"
    })
});

router.post(`${baseURL}`+ '/Reset', (req, res) =>{
    ActualTotalLoad.collection.drop()
    .catch((err) => {
    })
    AggregatedGenerationPerType.collection.drop()
    .catch((err) => {
    })
    DayAheadTotalLoadForecast.collection.drop()
    .catch((err) => {
    })
    User.collection.deleteMany({permission: "user"})
    .catch((err) => {
    })
    // AllocatedEICDetail.collection.drop()
    // .catch((err) => {
    // })
    // AreaTypeCode.collection.drop()
    // .catch((err) => {
    // })

    // MapCode.collection.drop()
    // .catch((err) => {
    // })
    // ProductionType.collection.drop()
    // .catch((err) => {
    // })
    // ResolutionCode.collection.drop()
    // .catch((err) => {
    // })
    res.status(200).send({
      status: "OK"
    });
});



module.exports =  router;
