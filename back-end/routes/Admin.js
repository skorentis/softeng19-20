const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const formidable = require('formidable');
const sha256 = require('sha256');

var {authenticate_admin} = require('../middleware/authenticate_admin');
var {ActualTotalLoad} = require('../models/ActualTotalLoad');
var {AggregatedGenerationPerType} = require('../models/AggregatedGenerationPerType');
var {DayAheadTotalLoadForecast} = require('../models/DayAheadTotalLoadForecast');
var {User} = require('../models/User');

var baseURL = process.env.baseURL;
const router = express.Router();



//Admin Endpoints
router.post(`${baseURL}`+ '/Admin/users', authenticate_admin, (req, res) => {
  var new_user = new User({
    username: req.body.username,
    password: sha256(req.body.password + process.env.JWT_SECRET),
    email: req.body.email,
    quota: req.body.quota
  });

  new_user.save().then((doc) => {
    // res.status(201).json({
    //   message: "User '" + new_user.req.query.username + "' was added.",
    //   new_user_doc: doc
    // })
    res.status(200).json({ newUser: req.body.username, newDoc: doc });
  }, (e) => {
      console.log(e);
      res.status(400).end(e);
  }).catch((e) => {
      res.status(400).send(e);
    });
});

router.get(`${baseURL}`+ '/Admin/users/:username', authenticate_admin, (req, res) => {
  User.findOne({username: req.params.username}).then((user) => {
    if(!user) {
      return res.status(403).send({message: `Sorry, no user ${req.params.username} was found. Try again a different username.`})
    }
    var return_user = new User ({
      username: user.username,
      password: 'unsafe - check the db',
      email: user.email,
      quota: user.quota,
      quota_limit: user.quota_limit
    })
    res.send(return_user);
  }).catch((e) => {
      res.status(400).send(e);
    });
});

router.put(`${baseURL}`+ '/Admin/users/:username', authenticate_admin, (req, res) => {
  User.findOne({username: req.params.username}).then((user) => {
    if(!user)
      return res.status(403).send({message: `Sorry, no user ${req.params.username} was found. Try again a different username.`})

    if(req.body.password)
      user.password = sha256(req.body.password + process.env.JWT_SECRET);
    if(req.body.quota)
      user.quota = req.body.quota;
    if(req.body.email)
      user.email = req.body.email;
    if(req.body.quota_limit)
      user.quota = req.body.quota_limit;


    user.save().then((doc) => {
      res.status(201).send({
        text: user.username + "'s account modified successfully"
      })
    }, (e) => {
        console.log(e);
    })
  }).catch((e) => {
      res.status(400).send(e);
    });
});

router.post(`${baseURL}`+ '/Admin/:dataset', authenticate_admin, (req, res) => {
  var totalRecordsInFile = 0;
  var totalRecordsImported = 0;
  var dataset = req.params.dataset;
  var form = new formidable.IncomingForm();

  if (dataset === "ActualTotalLoad"){
    form.parse(req, function (err, fields, files) {
      var error_flag = 0;
      var error_message;
      var oldpath = files.file.path;
      var newpath = './uploads/' + files.file.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err){
          console.log(err);
          return res.status(400).send(err);
        }
        var readStream = fs.createReadStream('./uploads/' + files.file.name);

        readStream.pipe(csv({ separator: ';' }))
        .on('headers', (headers) => {
          headers[0] = 'Id';
          console.log("Upload Complete. Storing document in db...");
        })
        .on('data', (row) => {
          var new_doc = new ActualTotalLoad(row);
          totalRecordsInFile = totalRecordsInFile + 1

          new_doc.save().then((doc) => {
            totalRecordsImported = totalRecordsImported + 1
          }, (e) => {
            if(e.code === 11000){
              console.log("duplicate key - error");
            }
            else {
              error_flag = 1 ;
              error_message = e.message;
              //console.log(e.message);
            }
          }).catch((e) => {
              return res.status(400).send(e);
          });
        })
        .on('error', (e) => {
          //console.log(e);
          return res.status(400).send(e);
        })
        .on('end', () => {
          if(error_flag === 1){
            console.log("[-] error: " + error_message);
            res.status(400).send(error_message);
          }
          else{
            console.log("[+] [" + files.file.name + "] stored in db");
            ActualTotalLoad.countDocuments({}, function(err, count){
              res.send({
                totalRecordsInFile: totalRecordsInFile,
                totalRecordsImported: totalRecordsImported,
                totalRecordsInDatabase: count
              })
            });
          }
        });
      });
    });
  }

  else if(dataset === "AggregatedGenerationPerType"){
    form.parse(req, function (err, fields, files) {
      var error_flag = 0;
      var error_message;
      var oldpath = files.file.path;
      var newpath = './uploads/' + files.file.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err){
          console.log(err);
          return res.status(400).send();
        }
        fs.createReadStream('./uploads/' + files.file.name)
        .pipe(csv({ separator: ';' }))
        .on('headers', (headers) => {
          headers[0] = 'Id';
          console.log("Upload Complete. Storing document in db...");
        })
        .on('data', (row) => {
          var new_doc = new AggregatedGenerationPerType(row);
          totalRecordsInFile = totalRecordsInFile + 1

          new_doc.save().then((doc) => {
            totalRecordsImported = totalRecordsImported + 1
          }, (e) => {
            if(e.code === 11000){
              console.log("duplicate key - error");
            }
            else{
              error_flag = 1 ;
              error_message = e.message;
              //console.log(e.message);
            }
          }).catch((e) => {
              return res.status(400).send(e);
          });
        })
        .on('error', (e) => {
          //console.log(e);
          return res.status(400).send();
        })
        .on('end', () => {
          if(error_flag === 1){
            console.log("[-] error: " + error_message);
            res.status(400).send(error_message);
          }
          else{
            console.log("[+] [" + files.file.name + "] stored in db");
            AggregatedGenerationPerType.countDocuments({}, function(err, count){
              res.send({
                totalRecordsInFile: totalRecordsInFile,
                totalRecordsImported: totalRecordsImported,
                totalRecordsInDatabase: count
              })
            });
          }
        });
      });
    });
  }

  else if(dataset === "DayAheadTotalLoadForecast"){
    form.parse(req, function (err, fields, files) {
      var error_flag = 0;
      var error_message;
      var oldpath = files.file.path;
      var newpath = './uploads/' + files.file.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err){
          console.log(err);
          return res.status(400).send();
        }
        fs.createReadStream('./uploads/' + files.file.name)
        .pipe(csv({ separator: ';' }))
        .on('headers', (headers) => {
          headers[0] = 'Id';
          console.log("Upload Complete. Storing document in db...");
        })
        .on('data', (row) => {
          var new_doc = new DayAheadTotalLoadForecast(row);
          totalRecordsInFile = totalRecordsInFile + 1

          new_doc.save().then((doc) => {
            totalRecordsImported = totalRecordsImported + 1
          }, (e) => {
            if(e.code === 11000){
              console.log("duplicate key - error");
            }
            else{
              error_flag = 1 ;
              error_message = e.message;
              //console.log(e.message);
            }
          }).catch((e) => {
              return res.status(400).send(e);
          });
        })
        .on('error', (e) => {
          //console.log(e);
          return res.status(400).send();
        })
        .on('end', () => {
          if(error_flag === 1){
            console.log("[-] error: " + error_message);
            res.status(400).send(error_message);
          }
          else{
            console.log("[+] [" + files.file.name + "] stored in db");
            DayAheadTotalLoadForecast.countDocuments({}, function(err, count){
              res.send({
                totalRecordsInFile: totalRecordsInFile,
                totalRecordsImported: totalRecordsImported,
                totalRecordsInDatabase: count
              })
            });
          }
        });
      });
    });
  }

  else{
    res.status(400).send();
  }
});



module.exports =  router;
