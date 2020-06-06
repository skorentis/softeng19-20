const converter = require('json-2-csv');
const csv = require('csv-parser');
const express = require('express');

var {authenticate} = require('../middleware/authenticate');
var {ActualTotalLoad} = require('../models/ActualTotalLoad');
var {AreaTypeCode} = require('../models/AreaTypeCode');
var {MapCode} = require('../models/MapCode');
var {ResolutionCode} = require('../models/ResolutionCode');

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




//Actual Total Load Endpoints
router.get(`${baseURL}` + '/ActualTotalLoad/:AreaName/:Resolution/date/:date', authenticate, (req, res) => {
  var format = "json" ;
  if (req.query.format === "csv") {
    format = "csv" ;
  }
  else if (!req.query.format) {
    format = "json" ;
  }
  else if (req.query.format !== "json") {
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});
  }
  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var date = req.params.date.split("-");
  if(date.length != 3)
    return res.status(400).send({message: `Invalid date format: date should be YYYY-MM-DD`});
  var Year = date[0];
  var Month = date[1];
  var Day = date[2];

  ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
    if(!ResolutionCodeDoc)
        return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

    ActualTotalLoad.find({
      AreaName: AreaName,
      Year: Year,
      Month: Month,
      Day: Day,
      ResolutionCodeId: ResolutionCodeDoc.Id
    })
    .then((docs) => {
      if (docs.length == 0)
        return res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});

        var return_object =[];
        docs.forEach((elem,index,array) => {
          AreaTypeCode.findOne({Id: elem.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
            MapCode.findOne({Id: elem.MapCodeId}).then((MapCodeDoc) => {
                return_object.push({
                  Source: "entso-e",
                  Dataset: "ActualTotalLoad",
                  AreaName: AreaName,
                  AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                  MapCode: MapCodeDoc.MapCodeText,
                  ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                  Year: Year,
                  Month: Month,
                  Day: Day,
                  DateTimeUTC: elem.DateTime,
                  ActualTotalLoadValue: elem.TotalLoadValue,
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
    }, (e) => {
        res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});
    })
  }).catch((e) => {
      res.status(400).send(e);
    });
})

router.get(`${baseURL}`+ '/ActualTotalLoad/:AreaName/:Resolution/month/:date', authenticate, (req, res) => {
  var format = "json" ;
  if(req.query.format === "csv")
    format = "csv" ;
  else if(!req.query.format)
    format = "json" ;
  else if(req.query.format !== "json")
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});

  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var date = req.params.date.split("-");
  if(date.length != 2)
    return res.status(400).send({message: `Invalid date format: date should be YYYY-MM`});
  var Year = date[0];
  var Month = date[1];
    ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
    if(!ResolutionCodeDoc)
        return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

    ActualTotalLoad.aggregate([
      {
        $match: {
              AreaName: AreaName,
              Year: Year,
              Month: Month,
              ResolutionCodeId: ResolutionCodeDoc.Id
          }
      },
      {
        $group : {
          _id: {AreaName:"$AreaName",AreaTypeCodeId:"$AreaTypeCodeId", Day:"$Day", Year:"$Year",
          Month:"$Month", MapCodeId:"$MapCodeId",ResolutionCodeId:"$ResolutionCodeId"},
          ActualTotalLoadByDayValue:{$sum: "$TotalLoadValue"}
        }
      }
    ]).then( (docs) => {
      if(docs.length == 0)
        return res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});

        var return_object =[];
        docs.forEach((elem,index,array) => {
        AreaTypeCode.findOne({Id: elem._id.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
          MapCode.findOne({Id: elem._id.MapCodeId}).then((MapCodeDoc) => {
              return_object.push({
                Source: "entso-e",
                Dataset: "ActualTotalLoad",
                  AreaName: AreaName,
                  AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                  MapCode: MapCodeDoc.MapCodeText,
                  ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                  Year: Year,
                  Month: Month,
                  Day: elem._id.Day,
                  ActualTotalLoadByDayValue: elem.ActualTotalLoadByDayValue
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
    }, (e) => {
        res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});
    })
  }).catch((e) => {
      res.status(400).send(e);
    });
});

router.get(`${baseURL}`+ '/ActualTotalLoad/:AreaName/:Resolution/year/:date', authenticate, (req, res) => {
  var format = "json" ;
  if(req.query.format === "csv")
    format = "csv" ;
  else if(!req.query.format)
    format = "json" ;
  else if(req.query.format !== "json")
    return res.status(400).send({message: `Invalid format: format should be { 'csv' | 'json' }`});

  var AreaName = req.params.AreaName;
  var ResolutionCodeText = req.params.Resolution;
  var Year = req.params.date;
  if(!(+Year)){
    return res.status(400).send({message: `Invalid date format: date should be YYYY`});
  }


    ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
    if(!ResolutionCodeDoc)
        return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});

    ActualTotalLoad.aggregate([
      {
        $match: {
              AreaName: AreaName,
              Year: Year,
              ResolutionCodeId: ResolutionCodeDoc.Id
          }
      },
      {
        $group : {
          _id: {AreaName:"$AreaName",AreaTypeCodeId:"$AreaTypeCodeId", Year:"$Year",
          Month:"$Month", MapCodeId:"$MapCodeId",ResolutionCodeId:"$ResolutionCodeId"},
           ActualTotalLoadByMonthValue:{$sum: "$TotalLoadValue"}
        }
      },
      {
        $sort : {
          _id: 1
        }
      }
    ]).then( (docs) => {
      if(docs.length == 0)
        return res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});

        var return_object =[];
        docs.forEach((elem,index,array) => {
        AreaTypeCode.findOne({Id: docs[0]._id.AreaTypeCodeId}).then((AreaTypeCodeDoc) => {
          MapCode.findOne({Id: docs[0]._id.MapCodeId}).then((MapCodeDoc) => {

              return_object.push({
                Source: "entso-e",
                Dataset: "ActualTotalLoad",
                  AreaName: AreaName,
                  AreaTypeCode: AreaTypeCodeDoc.AreaTypeCodeText,
                  MapCode: MapCodeDoc.MapCodeText,
                  ResolutionCode: ResolutionCodeDoc.ResolutionCodeText,
                  Year: Year,
                  Month: elem._id.Month,
                  ActualTotalLoadByMonthValue: elem.ActualTotalLoadByMonthValue
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
    }, (e) => {
        res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});
    })
  }).catch((e) => {
      res.status(400).send(e);
      console.log(e);
    });
});



module.exports =  router;
