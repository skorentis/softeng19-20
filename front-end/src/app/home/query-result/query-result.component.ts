import { Component, OnInit, OnDestroy } from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min.js';
import { QueriesService } from '../queries.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface ActualTotalLoadResult {
  source: string;
  dataset: string;
  areaName: string;
  areaTypeCode: string;
  mapCode: string;
  resolutionCode: string;
  year: number;
  month: number;
  day: number;
  dateTimeUTC: Date;
  actualTotalLoadValue: number;
  updateTimeUTC: Date;
}

@Component({
  selector: 'app-query-result',
  templateUrl: './query-result.component.html',
  styleUrls: ['./query-result.component.css']
})
export class QueryResultComponent implements OnInit, OnDestroy {
  COLUMNS_OUTPUT = {
    Source: 'Source',
    Dataset: 'Dataset',
    AreaName: 'Area Name',
    AreaTypeCode: 'Area Type Code',
    MapCode: 'Map Code',
    ResolutionCode: 'Resolution',
    Year: 'Year',
    Month: 'Month',
    Day: 'Day',
    DateTimeUTC: 'DateTime UTC',
    UpdateTimeUTC: 'UpdateTime UTC',
    ActualTotalLoadValue: 'Actual Total Load',
    ActualTotalLoadByDayValue: 'Actual Total Load by Day',
    ActualTotalLoadByMonthValue: 'Actual Total Load by Month',
    ProductionType: 'Production Type',
    AggregatedGenerationOutputValue: 'Aggregated Generation',
    AggregatedGenerationOutputByDayValue: 'Aggregated Generation by Day',
    AggregatedGenerationOutputByMonthValue: 'Aggregated Generation by Month',
    DayAheadTotalLoadForecastValue: 'Day Ahead Total Load Forecast',
    DayAheadTotalLoadForecastByDayValue: 'Day Ahead Total Load Forecast by Day',
    DayAheadTotalLoadForecastByMonthValue: 'Day Ahead Total Load Forecast by Month'
  };

  public table = false;
  public graph = false;
  public result = false;

  public columns = [];
  public queryResult = [];
  public chartData = [];
  private queryResultSub: Subscription;

  constructor(private queriesService: QueriesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.displayResults();
    this.queryResultSub = this.queriesService
      .getQueryResultUpdateListener('query result')
      .subscribe((updated: boolean) => {
        if (updated) {
          this.displayResults();
        }
      });
  }

  displayResults() {
    this.queryResult = this.queriesService.getRESULTS().queryResult;
    this.chartData = this.queriesService.getRESULTS().chartData;
    if (!this.queryResult || this.queryResult.length === 0) {
      return;
    }
    this.result = true;
    this.table = true;
    this.formalizeColumnsNames(this.queryResult);
    this.columns = Object.keys(this.queryResult[0]);
    this.createChart(this.chartData);
  }

  createChart(_chartData) {
    let chart = new CanvasJS.Chart('cavnas', {
      animationEnabled: true,
      zoomEnabled: true,
      theme: 'light1',
      exportEnabled: true,
      axisX: {
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        },
        // interval: 3,
      },
      axisY: {
        includeZero: false,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        }
      },
      data: _chartData
    });
    chart.render();
  }

  formalizeColumnsNames(resultArray) {
    for (const result of resultArray) {
      for (let key in result) {
        result[this.COLUMNS_OUTPUT[key]] = result[key]
        delete result[key]
      }
    }
  }

  getTwoDigitHourAndMinute(someDate): string {
    let hours = someDate.getHours();
    hours = ('0' + hours).slice(-2);
    let minutes = someDate.getMinutes();
    minutes = ('0' + minutes).slice(-2);
    return hours + ':' + minutes;
  }

  getHourMinute(someDate): string {
    return (new Date(someDate)).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  ngOnDestroy() {
    this.queryResultSub.unsubscribe();
  }

}
