import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, throwError } from 'rxjs';
import { Query } from './query.model';
import * as csv from 'csvtojson';

// import * as ab2str from 'arraybuffer-to-string';

@Injectable({ providedIn: 'root'})
export class QueriesService {
  private currentQuery: Query;
  private queryResult = [];
  private data;
  queryResultUpdated = new Subject<boolean>();

  resultsExistSubject = new Subject<boolean>();
  private resultsExist = false;

  constructor(private http: HttpClient, private router: Router) {}

  public getQueryResultUpdateListener(word: string) {
    console.log('summoned from: ', word);
    return this.queryResultUpdated.asObservable();
  }

  getResultsExistSubject() {
    return this.resultsExistSubject.asObservable();
  }

  getResultsExist() {
    return this.resultsExist;
  }

  getRESULTS() {
    if (!this.queryResult || !this.data) {
      return;
    } else {
      return {
        queryResult: JSON.parse(JSON.stringify( this.queryResult )),
        chartData: [...this.data]
      };
    }
  }

  getQueryFields() {
    if (!this.currentQuery) {
      return;
    } else {
      return JSON.parse(JSON.stringify(this.currentQuery));
    }
  }

  clearResults() {
    this.queryResult = [];
    // this.queryResultUpdated.next(false);

    this.resultsExist = false;
    this.resultsExistSubject.next(false);
  }

  clearQueryFields() {
    this.currentQuery = {
      dataset: '',
      areaName: '',
      productionType: '',
      resolution: '',
      year: '',
      month: '',
      day: ''
    };
    this.data = [];
  }

  getTempResults(query: Query, format: string) {
    if (JSON.stringify(this.currentQuery) === JSON.stringify(query)) {
      console.log('the same');
      this.queryResultUpdated.next(false);
    } else {
      /*
        SEND HTTP REQUESTS TO GET RESULTS
        chooseEndpoint() returns queryResult[]
        setUpDataForTable should take query and queryResult
      */
      this.chooseEndpointAndGetResults(query, format);

      // // ----------- UNCOMMENT THESE ------------
      // // Setup data for table and graph
      // this.setUpDataForTableAndGraph(query);
      // this.currentQuery = query;
      // // Save query fields, result data and graph data to local storage
      // this.saveResultDataAndQueryFields(this.queryResult, this.data, this.currentQuery);
      // this.router.navigate(['/home/result',
      //   {
      //     dataset: query.dataset,
      //     areaName: query.areaName,
      //     productionType: query.productionType ? query.productionType : 'null',
      //     resolution: query.resolution,
      //     year: query.year,
      //     month: query.month ? query.month : 'null',
      //     day: query.day ? query.day : 'null'
      //   }
      // ]);
      // this.queryResultUpdated.next(true);
      // // ----------------------------------------
    }
  }

  private setUpDataForTableAndGraph(query: Query) {
    // setUp data for graph
    if (query.dataset === 'Actual Total Load') {
      let dataPoints = [];
      if (query.day) {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(result.DateTimeUTC), y: result.ActualTotalLoadValue });
        });
      } else if (query.month) {
        this.queryResult.forEach(result => {
          // tslint:disable-next-line: max-line-length
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Month), Number(result.Day)), y: result.ActualTotalLoadByDayValue });
        });
      } else {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Month)), y: result.ActualTotalLoadByMonthValue });
        });
      }
      this.data = [
        {
          type: 'spline',
          color: 'blue',
          name: 'Actual Total Load',
          showInLegend: true,
          markerSize: 5,
          dataPoints: dataPoints
        }
      ];
    } else if (query.dataset === 'Aggregated Generation Per Type') {
      let dataPoints = [];
      if (query.day) {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(result.DateTimeUTC), y: result.ActualGenerationOutputValue });
        });
      } else if (query.month) {
        this.queryResult.forEach(result => {
          // tslint:disable-next-line: max-line-length
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Month), Number(result.Day)), y: result.ActualGenerationOutputByDayValue });
        });
      } else {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Month)), y: result.ActualGenerationOutputByMonthValue });
        });
      }
      this.data = [
        {
          type: 'spline',
          color: 'green',
          name: 'Aggregated Generation: ' + query.productionType,
          showInLegend: true,
          markerSize: 5,
          dataPoints: dataPoints
        }
      ];
    } else if (query.dataset === 'Day-Ahead Total Load Forecast') {
      let dataPoints = [];
      if (query.day) {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(result.DateTimeUTC), y: result.DayAheadTotalLoadForecastValue });
        });
      } else if (query.month) {
        this.queryResult.forEach(result => {
          // tslint:disable-next-line: max-line-length
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Month), Number(result.Day)), y: result.DayAheadTotalLoadForecastByDayValue });
        });
      } else {
        this.queryResult.forEach(result => {
          dataPoints.push({ x: new Date(Number(result.Year), Number(result.Mnoth)), y: result.DayAheadTotalLoadForecastByMonthValue });
        });
      }
      this.data = [
        {
          type: 'spline',
          color: 'red',
          name: 'Day-Ahead Forecast',
          showInLegend: true,
          markerSize: 5,
          dataPoints: dataPoints
        }
      ];
    } else {
      let dataPoints1 = [];
      let dataPoints2 = [];
      if (query.day) {
        this.queryResult.forEach(result => {
          dataPoints1.push({ x: new Date(result.DateTimeUTC), y: result.ActualTotalLoadValue });
          dataPoints2.push({ x: new Date(result.DateTimeUTC), y: result.DayAheadTotalLoadForecastValue });
        });
      } else if (query.month) {
        this.queryResult.forEach(result => {
          dataPoints1.push({ x: new Date(Number(result.Year), Number(result.Month), Number(result.Day)), y: result.ActualTotalLoadByDayValue });
          dataPoints2.push({ x: new Date(Number(result.Year), Number(result.Month), Number(result.Day)), y: result.DayAheadTotalLoadForecastByDayValue });
        });
      } else {
        this.queryResult.forEach(result => {
          dataPoints1.push({ x: new Date(Number(result.Year), Number(result.Month)), y: result.ActualTotalLoadByMonthValue });
          dataPoints2.push({ x: new Date(Number(result.Year), Number(result.Month)), y: result.DayAheadTotalLoadForecastByMonthValue });
        });
      }
      this.data = [
        {
          type: 'spline',
          color: 'blue',
          name: 'Actual Total Load',
          showInLegend: true,
          markerSize: 5,
          dataPoints: dataPoints1
        },
        {
          type: 'spline',
          color: 'red',
          name: 'Day-Ahead Forecast',
          showInLegend: true,
          markerSize: 5,
          dataPoints: dataPoints2
        }
      ];

    }
  }

  makeDatesValid() {
    if (!this.queryResult || this.queryResult.length === 0) {
      console.log('No query result');
      return;
    }
    this.queryResult.forEach(result => {
      if (!(/ /.test(result.DateTimeUTC))) {
        return;
      }
      const date = result.DateTimeUTC.split(' ');
      const newDate = `${ date[0] }T${ date[1] }Z`;
      result.DateTimeUTC = newDate;
    });
  }

  /* ------  LOCAL STORAGE ------ */

  autoGetResultDataAndQueryFields() {
    const storageInfo = this.getResultDataAndQueryFields();
    if (!storageInfo) {
      return;
    }
    this.queryResult = storageInfo.savedQueryResult;
    this.data = storageInfo.savedData;
    this.currentQuery = storageInfo.savedFields;
    this.resultsExist = true;
    this.resultsExistSubject.next(true);
  }

  private saveResultDataAndQueryFields(_queryResult, _graphData, _query: Query) {
    localStorage.setItem('queryResultString', JSON.stringify( _queryResult ));
    localStorage.setItem('chartDataString', JSON.stringify( _graphData ));
    localStorage.setItem('queryFields', JSON.stringify(_query));
  }

  clearResultDataAndQueryFields() {
    localStorage.removeItem('queryResultString');
    localStorage.removeItem('chartDataString');
    localStorage.removeItem('queryFields');
  }

  private getResultDataAndQueryFields() {
    const _queryResult = JSON.parse(localStorage.getItem('queryResultString'));
    const _data = JSON.parse(localStorage.getItem('chartDataString'));
    const _queryFields = JSON.parse(localStorage.getItem('queryFields'));
    if (!_queryResult || !_data || !_queryFields) {
      return;
    } else {
      // Make stringified dates back to normal date objects before returning data
      _data.forEach(dataItem => {
        dataItem.dataPoints.forEach(dataPoint => {
          dataPoint.x = new Date(dataPoint.x);
        });
      });
      return {
        savedQueryResult: _queryResult,
        savedData: _data,
        savedFields: _queryFields
      };
    }
  }


  /* Choose endpoint and get the results */
  chooseEndpointAndGetResults(query: Query, format: string) {
    const newQuery = query;
    let dataset: String;
    let dateData: String;
    if (newQuery.dataset === 'Actual Total Load') {
      dataset = 'ActualTotalLoad';
      if (newQuery.day) {
        dateData = 'date';
        // this.getActualTotalLoadPerDay(newQuery);
      } else if (newQuery.month) {
        dateData = 'month';
          // this.getActualTotalLoadPerMonth(newQuery);
      } else {
        dateData = 'year';
          // this.getActualTotalLoadPerYear(newQuery);
      }
    } else if (newQuery.dataset === 'Aggregated Generation Per Type') {
        dataset = 'AggregatedGenerationPerType';
        if (newQuery.day) {
          dateData = 'date';
          // this.getAggregatedGenerationPerTypePerDay(newQuery);
        } else if (newQuery.month) {
        dateData = 'month';
        // this.getAggregatedGenerationPerTypePerMonth(newQuery);
        } else {
        dateData = 'year';
        // this.getAggregatedGenerationPerTypePerYear(newQuery);
        }
    } else if (newQuery.dataset === 'Day-Ahead Total Load Forecast') {
        dataset = 'DayAheadTotalLoadForecast'
        if (newQuery.day) {
        dateData = 'date';
        // this.getDayAheadForecastPerDay(newQuery);
        } else if (newQuery.month) {
        dateData = 'month';
        // this.getDayAheadForecastPerMonth(newQuery);
        } else {
        dateData = 'year';
        // this.getDayAheadForecastPerYear(newQuery);
        }
    } else if (newQuery.dataset === 'Actual vs Day-Ahead Total Load') {
        dataset = 'ActualvsForecast';
        if (newQuery.day) {
        dateData = 'date';
        // this.getActualvsDayAheadPerDay(newQuery);
        } else if (newQuery) {
        dateData = 'month';
        // this.getActualvsDayAheadPerMonth(newQuery);
        } else {
        dateData = 'year';
        // this.getActualvsDayAheadPerYear(newQuery);
        }
    }
    const path_to_resource = dataset + '/' + newQuery.areaName + '/' + (newQuery.productionType ? newQuery.productionType + '/' : '') + newQuery.resolution + '/' + dateData + '/' + newQuery.year + (newQuery.month ? '-' + newQuery.month + (newQuery.day ? '-' + newQuery.day : '') : '') + '?format=' + format;
    let responseFormat;
    if (format === 'csv') {
      responseFormat = {
        responseType: 'arraybuffer'
      };
    } else {
      responseFormat = {
        responseType: 'json'
      };
    }
    this.http.
      get('https://localhost:8765/energy/api/' + path_to_resource, responseFormat)
      .subscribe(queryResultData => {
        let query_result;
        if (format === 'csv') {
          query_result = this.convertToJSON(queryResultData);
        } else {
          query_result = queryResultData;
        }

        this.queryResult = [...query_result];
        this.queryResultUpdated.next(true);

        // ----------- UNCOMMENT THESE ------------
        // Make the dates valid
        this.makeDatesValid();
        // Setup data for table and graph
        console.log(this.queryResult)
        this.setUpDataForTableAndGraph(query);
        this.currentQuery = query;
        // Save query fields, result data and graph data to local storage
        this.saveResultDataAndQueryFields(this.queryResult, this.data, this.currentQuery);

        this.resultsExist = true;
        this.resultsExistSubject.next(true);
        this.router.navigate(['/home/result',
          {
            dataset: query.dataset,
            areaName: query.areaName,
            productionType: query.productionType ? query.productionType : 'null',
            resolution: query.resolution,
            year: query.year,
            month: query.month ? query.month : 'null',
            day: query.day ? query.day : 'null'
          }
        ]);
        // ----------------------------------------
      }, error => {
        if (error.status === 403) {
          this.clearResults();
          this.clearQueryFields();
          this.clearResultDataAndQueryFields();
          alert('Sorry, no data was found');
          this.router.navigate(['/home/result']);
        }
        console.log(error);
      });
  }


  // Converts to JSON array of objects
  convertToJSON(queryResult: ArrayBuffer) {
    let resultString = this.ab2str(queryResult);
    resultString = resultString.split('\n');
    const titlesArray = resultString[0].split(';');
    resultString = resultString.splice(1, resultString.length);

    const returnArray = [];

    resultString.forEach(result => {
      result = result.split(';');
      const returnObj = {};
      for (let i = 0; i < titlesArray.length; i++) {
        returnObj[titlesArray[i]] = result[i]
      }
      returnArray.push(returnObj);
    });
    return returnArray;

  }

  /* Convert ArrayBuffer to string */
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }





// SAVING AND RECOVERING USERSTATUS WITH HTTP CALLS
recoverUserStatus() {
  this.http
  .get('https://localhost:3000/api/users/status')
  .subscribe((res: {userStatus}) => {
    const userStatus = res.userStatus;

  })
}
saveUserStatus() {
  const userStatus = {
    queryResult: this.queryResult,
    chartData: this.data,
    queryFields: this.currentQuery
  };
  this.http
  .post('https://localhost:3000/api/users/status', userStatus)
  .subscribe(res => {
    console.log(res);
  });
}

/* ------------------------------------------------------- */



  getActualTotalLoadPerDay(query: Query) {
    this.http.
      get(
        // tslint:disable-next-line: max-line-length
        'https://localhost:8765/energy/api/ActualTotalLoad/' + query.areaName + '/' + query.resolution + '/date/' + query.year + '-' + query.month + '-' + query.day
      )
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // Commented to just check what queryResultData is
        // const query_result = queryResultData.result
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getActualTotalLoadPerMonth(query: Query) {
    this.http.
      get(
        'https://localhost:8765/energy/api/ActualTotalLoad/' + query.areaName + '/' + query.resolution + '/month/' + query.year + '-' + query.month
      )
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });

  }
  getActualTotalLoadPerYear(query: Query) {
    this.http.
      get(
          'https://localhost:3000/energy/api/ActualTotalLoad/' + query.areaName + '/' + query.resolution + '/year/' + query.year
      )
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getAggregatedGenerationPerTypePerDay(query: Query) {
    this.http.
      get(
        'https://localhost:3000/energy/api/AggregatedGenerationPerType/' + query.areaName + '/' + query.productionType + '/' + query.resolution + '/date/' + query.year + '-' + query.month + '-' + query.day
      )
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getAggregatedGenerationPerTypePerMonth(query: Query) {
    this.http.get('https://localhost:3000/energy/api/AggregatedGenerationPerType/' + query.areaName + '/' + query.productionType + '/' + query.resolution + '/month/' + query.year + '-' + query.month)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getAggregatedGenerationPerTypePerYear(query: Query) {
    this.http.get('https://localhost:3000/energy/api/AggregatedGenerationPerType/' + query.areaName + '/' + query.productionType + '/' + query.resolution + '/year/' + query.year)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getDayAheadForecastPerDay(query: Query) {
    this.http.get('https://localhost:3000/energy/api/DayAheadTotalLoadForecast/' + query.areaName + '/' + query.resolution + '/date/' + query.year + '-' + query.month + '-' + query.day)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getDayAheadForecastPerMonth(query: Query) {
    this.http.get('https://localhost:3000/energy/api/DayAheadTotalLoadForecast/' + query.areaName + '/' + query.resolution + '/month/' + query.year + '-' + query.month)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getDayAheadForecastPerYear(query: Query) {
    this.http.get('https://localhost:3000/energy/api/DayAheadTotalLoadForecast/' + query.areaName + '/' + query.resolution + '/year/' + query.year)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getActualvsDayAheadPerDay(query: Query) {
    this.http.get('https://localhost:3000/energy/api/ActualvsForecast/' + query.areaName + '/' + query.resolution + '/date/' + query.year + '-' + query.month + '-' + query.day)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getActualvsDayAheadPerMonth(query: Query) {
    this.http.get('https://localhost:3000/energy/api/ActualvsForecast/' + query.areaName + '/' + query.resolution + '/month/' + query.year + '/' + query.month)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }

  getActualvsDayAheadPerYear(query: Query) {
    this.http.get('https://localhost:3000/energy/api/ActualvsForecast/' + query.areaName + '/' + query.resolution + '/year/' + query.year)
      .subscribe(queryResultData => {
        console.log(queryResultData + ' \n queryResultData type: ' + typeof(queryResultData));
        // const query_result = queryResultData.result;
        // this.queryResult = query_result;
        // this.queryResultUpdated.next(true);
      });
  }


}
