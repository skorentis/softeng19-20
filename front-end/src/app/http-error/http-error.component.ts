import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
  templateUrl: './http-error.component.html'
})
export class HttpErrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}
}
