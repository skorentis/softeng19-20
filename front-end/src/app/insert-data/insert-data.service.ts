import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InsertDataService {

  constructor(private http: HttpClient) { }

  uploadCSVFile(dataset: string, csvFormData) {
    return this.http
      .post<any>('https://localhost:8765/energy/api/Admin/' + dataset, csvFormData)
    //   .subscribe(res => {
    //     alert('Succesfully uploaded');
    //     // alert(res);
    //     console.log(res);
    //   }, error => {
    //     alert('Got error');
    //     // alert(error);
    //     console.log(error);
    //   }
    // );
  }

}
