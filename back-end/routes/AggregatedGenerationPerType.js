const converter = require('json-2-csv');
const csv = require('csv-parser');
const express = require('express');

var {authenticate} = require('../middleware/authenticate');
var {AggregatedGenerationPerType} = require('../models/AggregatedGenerationPerType');
var {AreaTypeCode} = require('../models/AreaTypeCode');
var {MapCode} = require('../models/MapCode');
var {ResolutionCode} = require('../models/ResolutionCode');
var {ProductionType} = require('../models/ProductionType');

var baseURL = process.env.baseURL;
const router = express.Router();


function sort_by_datetime(json1, json2) {
  var hms1 = json1.DateTimeUTC.split(" ")[1].split(":")
  var hms2 = json2.DateTimeUTC.split(" ")[1].split(":")
  var total_time1 = 3600*parseFloat(hms1[0]) + 60*parseFloat(hms1[1]) + parseFloat(hms1[2])
  var total_time2 = 3600*parseFloat(hms2[0]) + 60*parseFloat(hms2[1]) + parseFloat(hms2[2])

  if(total_time1>total_time2)
    return 1
  if(total_time1<total_time2)
    return -1

  return 0;
}

function sort_by_day(json1, json2) {
  var val1 = parseInt(json1.Day, 10)
  var val2 = parseInt(json2.Day, 10)

  if(val1>val2)
    return 1
  if(val1<val2)
    return -1

  return 0;
}

function sort_by_month(json1, json2) {
  var val1 = parseInt(json1.Month, 10)
  var val2 = parseInt(json2.Month, 10)

  if(val1>val2)
    return 1
  if(val1<val2)
    return -1

  return 0;
}


//Aggregated Generation Per Type Endpoints
router.get(`${baseURL}`+ '/AggregatedGenerationPerType/:AreaName/:ProductionType/:Resolution/date/:date', authenticate, (req, res) => {
  var format = "json" ;
  if(req.query.format === "csv")
    format = "csv" ;
  else if(!req.query.format)
    format = "json" ;
  else if(req.query.format !== "json")
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});

  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var ProductionTypeText = req.params.ProductionType.split('{').join('').split('}').join('');
  var date = req.params.date.split("-");
  if(date.length != 3)
    return res.status(400).send({message: `Invalid date format: date should be YYYY-MM-DD`});
  var Year = date[0];
  var Month = date[1];
  var Day = date[2];

  ProductionType.findOne({ProductionTypeText: ProductionTypeText}).then((ProductionTypeDoc)=>{
    if(!ProductionTypeDoc)
        return res.status(403).send({message: `Sorry, no data with production type '${ProductionTypeText}' was found. Try again with different parameters.`});

  ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
      if(!ResolutionCodeDoc)
          return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

      var searchObj;
      if(ProductionTypeText == "AllTypes"){
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          Month: Month,
          Day: Day,
          ResolutionCodeId: ResolutionCodeDoc.Id
        };
      }
      else{
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          Month: Month,
          Day: Day,
          ResolutionCodeId: ResolutionCodeDoc.Id,
          ProductionTypeId: ProductionTypeDoc.Id
        };
    }

      AggregatedGenerationPerType.find(searchObj).then( (docs) => {
        if(docs.length == 0)
          return res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});

          var return_object =[];
          docs.forEach((elem,index,array) => {
            ProductionType.findOne({Id: elem.ProductionTypeId}).then((NewProductionTypeCodeDoc)=>{
              AreaTypeCode.findOne({Id: elem.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
               MapCode.findOne({Id: elem.MapCodeId}).then((MapCodeDoc) => {
                  return_object.push({
                    Source: "entso-e",
                    Dataset: "AggregatedGenerationPerType",
                    AreaName: AreaName,
                    AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                    MapCode: MapCodeDoc.MapCodeText,
                    ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                    Year: Year,
                    Month: Month,
                    Day: Day,
                    DateTimeUTC: elem.DateTime,
                    ProductionType: NewProductionTypeCodeDoc.ProductionTypeText,
                    ActualGenerationOutputValue: elem.ActualGenerationOutput,
                    UpdateTimeUTC: elem.UpdateTime
                });
                if(array.length == return_object.length){
                  return_object.sort(sort_by_datetime);
                  if(format === "csv")
                    converter.json2csv(return_object, (err, csv_file) => {
                      res.send(csv_file);
                    }, {
                          delimiter : {
                            field : ';'
                          }
                        });
                  else
                    res.send(return_object);
                }
              })
            })
          })
          })
      }, (e) => {
          res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});
      })
    })
  }).catch((e) => {
        res.status(400).send(e);
      });
});

router.get(`${baseURL}`+ '/AggregatedGenerationPerType/:AreaName/:ProductionType/:Resolution/month/:date', authenticate, (req, res) => {
  var format = "json" ;
  if(req.query.format === "csv")
    format = "csv" ;
  else if(!req.query.format)
    format = "json" ;
  else if(req.query.format !== "json")
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});

  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var ProductionTypeText = req.params.ProductionType.split('{').join('').split('}').join('');
  var date = req.params.date.split("-");
  if(date.length != 2)
    return res.status(400).send({message: `Invalid date format: date should be YYYY-MM`});
  var Year = date[0];
  var Month = date[1];

  ProductionType.findOne({ProductionTypeText: ProductionTypeText}).then((ProductionTypeDoc)=>{
    if(!ProductionTypeDoc)
      return res.status(403).send({message: `Sorry, no data with production type '${ProductionTypeText}' was found. Try again with different parameters.`});
  ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
      if(!ResolutionCodeDoc)
         return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

      var searchObj;
      if(ProductionTypeText == "AllTypes"){
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          Month: Month,
          ResolutionCodeId: ResolutionCodeDoc.Id
        };
      }
      else{
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          Month: Month,
          ResolutionCodeId: ResolutionCodeDoc.Id,
          ProductionTypeId: ProductionTypeDoc.Id
        };
    }

      AggregatedGenerationPerType.aggregate([
        {
          $match: searchObj
        },
        {
          $group : {
            _id: {AreaName:"$AreaName",AreaTypeCodeId:"$AreaTypeCodeId", Day:"$Day", Year:"$Year",
            Month:"$Month", MapCodeId:"$MapCodeId",ResolutionCodeId:"$ResolutionCodeId",ProductionTypeId:"$ProductionTypeId"},
             ActualGenerationOutputByDayValue:{$sum: "$ActualGenerationOutput"}
          }
        },
        {
          $sort : {
            _id: 1
          }
        }
      ]).then( (docs) => {
        if(docs.length == 0)
          return res.status(403).send({message: `Sorry, no data was found. Try again with different parameters.`});

          var return_object =[];
          docs.forEach((elem,index,array) => {
            ProductionType.findOne({Id: elem._id.ProductionTypeId}).then((NewProductionTypeCodeDoc)=>{
              AreaTypeCode.findOne({Id: elem._id.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
                MapCode.findOne({Id: elem._id.MapCodeId}).then((MapCodeDoc) => {
                  return_object.push({
                    Source: "entso-e",
                    Dataset: "AggregatedGenerationPerType",
                    AreaName: AreaName,
                    AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                    MapCode: MapCodeDoc.MapCodeText,
                    ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                    Year: Year,
                    Month: Month,
                    Day: elem._id.Day,
                    ProductionType: NewProductionTypeCodeDoc.ProductionTypeText,
                    ActualGenerationOutputByDayValue: elem.ActualGenerationOutputByDayValue
                });
                if(array.length == return_object.length){
                  return_object.sort(sort_by_day);
                  if(format === "csv")
                    converter.json2csv(return_object, (err, csv_file) => {
                      res.send(csv_file);
                    }, {
                          delimiter : {
                            field : ';'
                          }
                        });
                  else
                    res.send(return_object);
                }
              })
            })
          })
          })
      }, (e) => {
          res.status(403).send({message: `Sorry, no data was found. Try again with different parameters.`});
      })
    })
  }).catch((e) => {
        res.status(400).send(e);
        console.log(e);
      });
});

router.get(`${baseURL}`+ '/AggregatedGenerationPerType/:AreaName/:ProductionType/:Resolution/year/:date', authenticate, (req, res) => {
  var format = "json" ;
  if(req.query.format === "csv")
    format = "csv" ;
  else if(!req.query.format)
    format = "json" ;
  else if(req.query.format !== "json")
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});

  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var ProductionTypeText = req.params.ProductionType.split('{').join('').split('}').join('');
  var Year = req.params.date;
  if(!(+Year)){
    return res.status(400).send({message: `Invalid date format: date should be YYYY`});
  }

  ProductionType.findOne({ProductionTypeText: ProductionTypeText}).then((ProductionTypeDoc)=>{
    if(!ProductionTypeDoc)
      return res.status(403).send({message: `Sorry, no data with production type '${ProductionTypeText}' was found. Try again with different parameters.`});
  ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
      if(!ResolutionCodeDoc)
          return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

      var searchObj;
      if(ProductionTypeText == "AllTypes"){
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          ResolutionCodeId: ResolutionCodeDoc.Id
        };
      }
      else{
        searchObj = {
          AreaName: AreaName,
          Year: Year,
          ResolutionCodeId: ResolutionCodeDoc.Id,
          ProductionTypeId: ProductionTypeDoc.Id
        };
    }

      AggregatedGenerationPerType.aggregate([
        {
          $match: searchObj
        },
        {
          $group : {
            _id: {AreaName:"$AreaName",AreaTypeCodeId:"$AreaTypeCodeId", Year:"$Year",
            Month:"$Month", MapCodeId:"$MapCodeId",ResolutionCodeId:"$ResolutionCodeId",ProductionTypeId:"$ProductionTypeId"},
             ActualGenerationOutputByMonthValue:{$sum: "$ActualGenerationOutput"}
          }
        },
        {
          $sort : {
            _id: 1
          }
        }
      ]).then( (docs) => {
        if(docs.length == 0)
          return res.status(403).send({message: `Sorry, no data was found. Try again with different parameters.`});

          var return_object =[];
          docs.forEach((elem,index,array) => {
            ProductionType.findOne({Id: elem._id.ProductionTypeId}).then((NewProductionTypeCodeDoc)=>{
              AreaTypeCode.findOne({Id: elem._id.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
                MapCode.findOne({Id: elem._id.MapCodeId}).then((MapCodeDoc) => {
                  return_object.push({
                    Source: "entso-e",
                    Dataset: "AggregatedGenerationPerType",
                    AreaName: AreaName,
                    AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                    MapCode: MapCodeDoc.MapCodeText,
                    ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                    Year: Year,
                    Month: elem._id.Month,
                    ProductionType: NewProductionTypeCodeDoc.ProductionTypeText,
                    ActualGenerationOutputByMonthValue: elem.ActualGenerationOutputByMonthValue
                });
                if(array.length == return_object.length){
                  return_object.sort(sort_by_month);
                  if(format === "csv")
                    converter.json2csv(return_object, (err, csv_file) => {
                      res.send(csv_file);
                    }, {
                          delimiter : {
                            field : ';'
                          }
                        });
                  else
                    res.send(return_object);
                }
              })
            })
          })
          })
      }, (e) => {
          res.status(403).send({message: `Sorry, no data was found. Try again with different parameters.`});
      })
    })
  }).catch((e) => {
        res.status(400).send(e);
        console.log(e);
      });
});



module.exports =  router;
