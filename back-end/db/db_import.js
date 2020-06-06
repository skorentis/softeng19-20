require('../db/mongoose');

const fs = require('fs');
const csv = require('csv-parser');
var {ActualTotalLoad} = require('../models/ActualTotalLoad');
var {AggregatedGenerationPerType} = require('../models/AggregatedGenerationPerType');
var {AllocatedEICDetail} = require('../models/AllocatedEICDetail');
var {AreaTypeCode} = require('../models/AreaTypeCode');
var {DayAheadTotalLoadForecast} = require('../models/DayAheadTotalLoadForecast');
var {MapCode} = require('../models/MapCode');
var {ProductionType} = require('../models/ProductionType');
var {ResolutionCode} = require('../models/ResolutionCode');


fs.createReadStream('./db/data/AllocatedEICDetail.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers[0] = 'Id';
  })
  .on('data', (row) => {
      var new_doc = new AllocatedEICDetail(row);
      
      new_doc.save().then((doc) => {
        //
      }, (e) => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log("[+] csv file[AllocatedEICDetail] stored in db");
   });


fs.createReadStream('./db/data/AreaTypeCode.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers[0] = 'Id';
  })
  .on('data', (row) => {
      var new_doc = new AreaTypeCode(row);
      
      new_doc.save().then((doc) => {
        //
      }, (e) => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log("[+] csv file[AreaTypeCode] stored in db");
   });


fs.createReadStream('./db/data/MapCode.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers[0] = 'Id';
  })
  .on('data', (row) => {
      var new_doc = new MapCode(row);
      
      new_doc.save().then((doc) => {
        //
      }, (e) => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log("[+] csv file[MapCode] stored in db");
   });


fs.createReadStream('./db/data/ProductionType.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers[0] = 'Id';
  })
  .on('data', (row) => {
      var new_doc = new ProductionType(row);
      
      new_doc.save().then((doc) => {
        //
      }, (e) => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log("[+] csv file[ProductionType] stored in db");
   });


fs.createReadStream('./db/data/ResolutionCode.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers[0] = 'Id';
  })
  .on('data', (row) => {
      var new_doc = new ResolutionCode(row);
      
      new_doc.save().then((doc) => {
        //
      }, (e) => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log("[+] csv file[ResolutionCode] stored in db");
   });