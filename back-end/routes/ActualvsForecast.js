const converter = require('json-2-csv');
const csv = require('csv-parser');
const express = require('express');
var request = require('request');

var {authenticate} = require('../middleware/authenticate');
var {DayAheadTotalLoadForecast} = require('../models/DayAheadTotalLoadForecast');
var {ActualTotalLoad} = require('../models/ActualTotalLoad');
var {User} = require('../models/User');
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


//Actual Total Load vs Day-Ahead Total Load Forecast Endpoints
router.get(`${baseURL}`+ '/ActualvsForecast/:AreaName/:Resolution/date/:date', authenticate, (req, res) => {
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
  if(date.length != 3)
    return res.status(400).send({message: `Invalid date format: date should be YYYY-MM-DD`});
  var Year = date[0];
  var Month = date[1];
  var Day = date[2];

  ResolutionCode.findOne({ResolutionCodeText: ResolutionCodeText}).then((ResolutionCodeDoc) => {
    if(!ResolutionCodeDoc)
        return res.status(403).send({message: `Sorry, no data with resolution code '${ResolutionCodeText}' was found. Try again with different parameters.`});
    User.findOne({permission: "admin"}).then( (admin) => {
      // sentToken = req.header('X-OBSERVATORY-AUTH').split(' ')[1];
      prenium_token = admin.token;
      // console.log(sentToken === prenium_token)
      request({
        url: 'https://localhost:8765' + `${baseURL}` + '/ActualTotalLoad/' + AreaName + '/' + ResolutionCodeDoc.ResolutionCodeText + '/date/' + req.params.date,
        headers: {
          "X-OBSERVATORY-AUTH": 'Bearer ' + prenium_token
        },
        method: "GET",
        json: true
      },function (error, response, body) {
          if(response.statusCode !== 200)
            return res.status(response.statusCode).send(response.body);
          var docs = body;

          if(docs.length == 0)
            return res.status(403).send({message: 'Sorry, no data was found. Try again with different parameters.'});

          var return_object =[];
          docs.forEach((elem,index,array) => {
            DayAheadTotalLoadForecast.findOne({AreaName: AreaName, ResolutionCodeId: ResolutionCodeDoc.Id, Year: Year, Month: Month, Day: Day, DateTime: elem.DateTimeUTC}).then((DayAheadTotalLoadForecastDoc) => {
              return_object.push({
                Source: "entso-e",
                Dataset: "ActualVSForecastedTotalLoad",
                AreaName: AreaName,
                AreaTypeCode: elem.AreaTypeCode,
                MapCode: elem.MapCode,
                ResolutionCode: elem.ResolutionCode,
                Year: Year,
                Month: Month,
                Day: Day,
                DateTimeUTC: elem.DateTimeUTC,
                DayAheadTotalLoadForecastValue: DayAheadTotalLoadForecastDoc.TotalLoadValue,
                ActualTotalLoadValue: elem.ActualTotalLoadValue
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
        }
       );
      })
  }).catch((e) => {
      res.status(400).send(e);
      console.log(e);
    });
});

router.get(`${baseURL}`+ '/ActualvsForecast/:AreaName/:Resolution/month/:date', authenticate, (req, res) => {
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
      User.findOne({permission: "admin"}).then( (admin) => {
        prenium_token = admin.token;
        request({
          url: 'https://localhost:8765' + `${baseURL}` + '/ActualTotalLoad/' + AreaName + '/' + ResolutionCodeDoc.ResolutionCodeText + '/month/' + req.params.date ,
          headers: {
            'X-OBSERVATORY-AUTH': 'Bearer ' + prenium_token
          },
          method: 'GET',
          json: true
        }, function (error, response, body) {
            if(response.statusCode !== 200)
              return res.status(response.statusCode).send(response.body);
            var ActualTotalLoadPerDayDocs = body;
            request({
              url: 'https://localhost:8765' + `${baseURL}` + '/DayAheadTotalLoadForecast/' + AreaName + '/' + ResolutionCodeDoc.ResolutionCodeText + '/month/' + req.params.date ,
              headers: {
                'X-OBSERVATORY-AUTH': 'Bearer ' + prenium_token
              },
              method: 'GET',
              json: true
            }, function (newerror, newresponse, newbody) {
                if(newresponse.statusCode !== 200)
                  return res.status(newresponse.statusCode).send(newresponse.body);
                var DayAheadTotalLoadForecastPerDayDocs = newbody;

                var return_object =[];
                ActualTotalLoadPerDayDocs.forEach((elem,index,array) => {
                  var index = DayAheadTotalLoadForecastPerDayDocs.findIndex((element) => element.Day === elem.Day);
                  return_object.push({
                    Source: "entso-e",
                    Dataset: "ActualVSForecastedTotalLoad",
                    AreaName: AreaName,
                    AreaTypeCode: elem.AreaTypeCode,
                    MapCode: elem.MapCode,
                    ResolutionCode: elem.ResolutionCode,
                    Year: Year,
                    Month: Month,
                    Day: elem.Day,
                    DayAheadTotalLoadForecastByDayValue: DayAheadTotalLoadForecastPerDayDocs[index].DayAheadTotalLoadForecastByDayValue,
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
              }
            );
          }
        );
      })
     }).catch((e) => {
      res.status(400).send(e);
      console.log(e);
      });
});

router.get(`${baseURL}`+ '/ActualvsForecast/:AreaName/:Resolution/year/:date', authenticate, (req, res) => {
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
      User.findOne({permission: "admin"}).then( (admin) => {
        prenium_token = admin.token;
        request({
          url: 'https://localhost:8765' + `${baseURL}` + '/ActualTotalLoad/' + AreaName + '/' + ResolutionCodeDoc.ResolutionCodeText + '/year/' + req.params.date ,
          headers: {
            'X-OBSERVATORY-AUTH': 'Bearer ' + prenium_token
          },
          method: 'GET',
          json: true
        }, function (error, response, body) {
            if(response.statusCode !== 200)
              return res.status(response.statusCode).send(response.body);
            var ActualTotalLoadPerMonthDocs = body;
            request({
              url: 'https://localhost:8765' + `${baseURL}` + '/DayAheadTotalLoadForecast/' + AreaName + '/' + ResolutionCodeDoc.ResolutionCodeText + '/year/' + req.params.date ,
              headers: {
                'X-OBSERVATORY-AUTH': 'Bearer ' + prenium_token
              },
              method: 'GET',
              json: true
            }, function (newerror, newresponse, newbody) {
                if(newresponse.statusCode !== 200)
                  return res.status(newresponse.statusCode).send(newresponse.body);
                var DayAheadTotalLoadForecastPerMonthDocs = newbody;

                var return_object =[];
                        ActualTotalLoadPerMonthDocs.forEach((elem,index,array) => {
                          var index = DayAheadTotalLoadForecastPerMonthDocs.findIndex((element) => element.Month === elem.Month);
                          return_object.push({
                            Source: "entso-e",
                            Dataset: "ActualVSForecastedTotalLoad",
                            AreaName: AreaName,
                            AreaTypeCode: elem.AreaTypeCode,
                            MapCode: elem.MapCode,
                            ResolutionCode: elem.ResolutionCode,
                            Year: Year,
                            Month: elem.Month,
                            DayAheadTotalLoadForecastByMonthValue: DayAheadTotalLoadForecastPerMonthDocs[index].DayAheadTotalLoadForecastByMonthValue,
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
                                  }
                              );
                            else
                              res.send(return_object);
                          }
                        })
              }
            );
          }
        );
      })
     }).catch((e) => {
        res.status(400).send(e);
        console.log(e);
      });
});



module.exports =  router;
