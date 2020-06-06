import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { InsertComponent } from './insert/insert.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    InsertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    AngularMaterialModule,
  ]
})
export class InsertDataModule { }
