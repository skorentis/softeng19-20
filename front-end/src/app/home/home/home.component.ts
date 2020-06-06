import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QueriesService } from '../queries.service';
import { Query } from '../query.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

export interface Option {
  name: string;
  number: number;
}

const DATASET = ['Actual Total Load', 'Aggregated Generation Per Type', 'Day-Ahead Total Load Forecast', 'Actual vs Day-Ahead Total Load']

const PRODUCTION_TYPE = [
  'AC Link',
  'Biomass',
  'DC Link',
  'Fossil Brown coal/Lignite',
  'Fossil Coal-derived gas',
  'Fossil Gas',
  'Fossil Hard coal',
  'Fossil Oil',
  'Fossil Oil shale',
  'Fossil Peat',
  'Geothermal',
  'Hydro Pumped Storage',
  'Hydro Run-of-river and poundage',
  'Hydro Water Reservoir',
  'Marine',
  'Nuclear',
  'Other',
  'Other renewable',
  'ProductionTypeText',
  'Solar',
  'Substation',
  'Transformer',
  'Waste',
  'Wind Offshore',
  'Wind Onshore'
];

const AREA_NAMES = [
  '50Hertz CA',
  'APG CA',
  'AST BZ',
  'AST CA',
  'Amprion CA',
  'AreaName',
  'Austria',
  'Belgium',
  'Bosnia Herzegovina',
  'Bulgaria',
  'CEPS BZ',
  'CEPS CA',
  'CGES BZ',
  'CGES CA',
  'CREOS CA',
  'Croatia',
  'Cyprus',
  'Cyprus TSO BZ',
  'Cyprus TSO CA',
  'Czech Republic',
  'DE-AT-LU',
  'DK1  BZ',
  'DK2 BZ',
  'Denmark',
  'ELES BZ',
  'ELES CA',
  'EMS BZ',
  'EMS CA',
  'ESO BZ',
  'ESO CA',
  'EirGrid CA',
  'Elering BZ',
  'Elering CA',
  'Elia BZ',
  'Elia CA',
  'Energinet CA',
  'Estonia',
  'Fingrid BZ',
  'Fingrid CA',
  'Finland',
  'Former Yugoslav Republic of Macedonia',
  'France',
  'Germany',
  'Greece',
  'HOPS BZ',
  'HOPS CA',
  'Hungary',
  'IPTO BZ',
  'IPTO CA',
  'IT-Centre-North BZ',
  'IT-Centre-South BZ',
  'IT-North BZ',
  'IT-Sardinia BZ',
  'IT-Sicily BZ',
  'IT-South BZ',
  'Ireland',
  'Italy',
  'Italy CA',
  'Latvia',
  'Litgrid BZ',
  'Litgrid CA',
  'Lithuania',
  'Luxembourg',
  'MAVIR BZ',
  'MAVIR CA',
  'MEPSO BZ',
  'MEPSO CA',
  'Montenegro',
  'NO1 BZ',
  'NO2 BZ',
  'NO3 BZ',
  'NO4 BZ',
  'NO5 BZ',
  'NOS BiH BZ',
  'NOS BiH CA',
  'National Grid BZ',
  'National Grid CA',
  'Netherlands',
  'Norway',
  'PSE SA BZ',
  'PSE SA CA',
  'Poland',
  'Portugal',
  'REE BZ',
  'REE CA',
  'REN BZ',
  'REN CA',
  'RTE BZ',
  'RTE CA',
  'Romania',
  'SE1 BZ',
  'SE2 BZ',
  'SE3 BZ',
  'SE4 BZ',
  'SEPS BZ',
  'SEPS CA',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Statnett CA',
  'SvK CA',
  'Sweden',
  'Switzerland',
  'TenneT GER CA',
  'TenneT NL BZ',
  'TenneT NL CA',
  'Transelectrica BZ',
  'Transelectrica CA',
  'TransnetBW CA',
  'Ukraine',
  'Ukraine BEI CA',
  'Ukraine BZN',
  'Ukraine IPS CA',
  'swissgrid BZ',
  'swissgrid CA'
];

const RESOLUTION_TYPE = [
  'PT15M',
  'PT60M',
  'PT30M',
  'P7D',
  'P1M',
  'P1Y',
  'P1D',
  'CONTRACT'
];

const YEAR = ['2020', '2019', '2018', '2017', '2016', '2015', '2014'];
const MONTH = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DAY = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31'
];

const FORMAT = ['json', 'csv'];


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private query: Query;
  form: FormGroup;

  private resultsExist: boolean;

  datasets = DATASET;
  areaNames = AREA_NAMES;
  productionTypes = PRODUCTION_TYPE;
  resolutions = RESOLUTION_TYPE;
  years = YEAR;
  months = MONTH;
  days = DAY;
  formats = FORMAT;

  scroll(el: HTMLElement) {
    el.scrollIntoView({ block: 'start',  behavior: 'smooth' });
  }

  constructor(private queriesService: QueriesService, private router: Router) { }

  ngOnInit() {
    this.query = this.queriesService.getQueryFields();
    this.form = new FormGroup({
      dataset: new FormControl(this.query ? this.query.dataset : null, [Validators.required]),
      areaName: new FormControl(this.query ? this.query.areaName : null, [Validators.required]),
      productionType: new FormControl(this.query ? this.query.productionType : null),
      resolution: new FormControl(this.query ? this.query.resolution : null, [Validators.required]),
      year: new FormControl(this.query ? this.query.year : null),
      month: new FormControl(this.query ? this.query.month : null),
      day: new FormControl(this.query ? this.query.day : null),
      format: new FormControl('json')
    });

    // this.setProductionTypeValidator();
    this.setDayValidator();
    this.setMonthValidator();
    this.setProductionValidator();

    this.resultsExist = this.queriesService.getResultsExist();
    if (this.resultsExist) {
      this.router.navigate(['/home/result']);
    }
  }

  // setProductionTypeValidator() {
  //   const datasetControl = this.form.get('dataset');
  //   const productionTypeControl = this.form.get('productionType')
  //   datasetControl.valueChanges
  //     .subscribe(dataset_control => {
  //       if (dataset_control.value !== 'Aggregated Generation Per Type') {
  //         this.form.patchValue({ productionType: null });
  //       } else {
  //         productionTypeControl.setValidators([Validators.required]);
  //       }
  //       productionTypeControl.updateValueAndValidity();
  //     });

  // }

  setMonthValidator() {
    const yearControl = this.form.get('year');
    const dayControl = this.form.get('day');
    this.form.get('month').valueChanges
      .subscribe(month => {
        if (!month) {
          if (!dayControl.value) {
            yearControl.setValidators(null);
            yearControl.updateValueAndValidity();
          }
        } else {
          yearControl.setValidators([Validators.required]);
          yearControl.updateValueAndValidity();
        }
      });
  }

  setDayValidator() {
    const monthControl = this.form.get('month');
    const yearControl = this.form.get('year');
    this.form.get('day').valueChanges
      .subscribe(day => {
        if (day) {
          monthControl.setValidators([Validators.required]);
          yearControl.setValidators([Validators.required]);
          monthControl.updateValueAndValidity();
          yearControl.updateValueAndValidity();
        } else {
          monthControl.clearValidators();
          if (!monthControl.value) {
            yearControl.clearValidators();
          }
          monthControl.updateValueAndValidity();
          yearControl.updateValueAndValidity();
        }
      });

  }

  setProductionValidator() {
    const datasetControl = this.form.get('dataset');
    const productionTypeControl = this.form.get('productionType');
    datasetControl.valueChanges
      .subscribe(dataset => {
        if (dataset === 'Aggregated Generation Per Type') {
          productionTypeControl.setValidators([Validators.required]);
        } else {
          this.form.patchValue({ productionType: null });
          productionTypeControl.clearValidators();
        }
        productionTypeControl.updateValueAndValidity();
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.query = {
      dataset: this.form.get('dataset').value,
      areaName: this.form.get('areaName').value,
      productionType: this.form.get('productionType').value,
      resolution: this.form.get('resolution').value,
      year: this.form.get('year').value,
      month: this.form.get('month').value,
      day: this.form.get('day').value
    };

    if (!this.query.year && !this.query.month && !this.query.day) {
      const tempDate = new Date();
      this.query.day = tempDate.getDate().toString();
      this.query.month = (tempDate.getMonth() + 1).toString();
      this.query.year = tempDate.getFullYear().toString();
    }

    this.queriesService.getTempResults(this.query, this.form.get('format').value);

    // if (this.form.get('dataset').value === 'Actual Total Load') {
    //   if (this.form.get('day')) {
    //     // this.queriesService.getActualTotalLoadPerDay(this.query);
    //     this.queriesService.getTempResults(this.query);
    //   }

  // else if (this.form.get('month')) {
  //       this.queriesService.getActualTotalLoadPerMonth(this.query);
  //     } else {
  //       this.queriesService.getActualTotalLoadPerYear(this.query);
  //     }
  //   } else if (this.form.get('dataset').value === 'Aggregated Generation Per Type') {
  //     if (this.form.get('day')) {
  //       this.queriesService.getAggregatedGenerationPerTypePerDay(this.query);
  //     } else if (this.form.get('month')) {
  //       this.queriesService.getAggregatedGenerationPerTypePerMonth(this.query);
  //     } else {
  //       this.queriesService.getAggregatedGenerationPerTypePerYear(this.query);
  //     }
  //   } else if (this.form.get('dataset').value === 'Day-Ahead Total Load Forecast') {
  //     if (this.form.get('day')) {
  //       this.queriesService.getDayAheadForecastPerDay(this.query);
  //     } else if (this.form.get('month')) {
  //       this.queriesService.getDayAheadForecastPerMonth(this.query);
  //     } else {
  //       this.queriesService.getDayAheadForecastPerYear(this.query);
  //     }
  //   } else if (this.form.get('dataset').value === 'Actual vs Day-Ahead Total Load') {
  //     if (this.form.get('day')) {
  //       this.queriesService.getActualvsDayAheadPerDay(this.query);
  //     } else if (this.form.get('month')) {
  //       this.queriesService.getActualvsDayAheadPerMonth(this.query);
  //     } else {
  //       this.queriesService.getActualvsDayAheadPerYear(this.query);
  //     }

    // }

  }

}
