import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';
import { InsertDataService } from '../insert-data.service';

const DATASET = [
  'Actual Total Load',
  'Aggregated Generation Per Type',
  'Day-Ahead Total Load Forecast'
];

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {
  uploadForm: FormGroup;
  datasets = DATASET;
  filename: string;

  isLoading = false;

  datasetDictionary = {
    'Actual Total Load': 'ActualTotalLoad',
    'Aggregated Generation Per Type': 'AggregatedGenerationPerType',
    'Day-Ahead Total Load Forecast': 'DayAheadTotalLoadForecast'
  };

  constructor(private insertDataService: InsertDataService) { }

  ngOnInit() {
    this.uploadForm = new FormGroup({
      dataset: new FormControl(null, {validators: [Validators.required]}),
      csvfile: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  onUpload() {
    if (this.uploadForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadForm.get('csvfile').value);

    const selectedDatasetInformal = this.uploadForm.get('dataset').value;
    const selectedDataset = this.datasetDictionary[selectedDatasetInformal];
    this.isLoading = true;
    this.insertDataService.uploadCSVFile(selectedDataset, formData)
      .subscribe(res => {
        alert('Succesfully uploaded');
        this.isLoading = false;
        // alert(res);
        console.log(res);
      }, error => {
        alert('Got error. Uploaded failed');
        this.isLoading = false;
        // alert(error);
        console.log(error);
      }
    );
  }

  onFilePicked(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const filename = file.name;
      this.filename = filename;
      this.uploadForm.patchValue({ csvfile: file });
      this.uploadForm.get('csvfile').updateValueAndValidity();
      // this.uploadForm.get('csvfile').setValue(file);
    }
  }

}
