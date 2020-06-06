import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AngularMaterialModule } from '../angular-material.module';

// import { QueryCreateComponent } from './query-create/query-create.component';
import { QueryNoResultComponent } from './query-no-result/query-no-result.component';
import { QueryResultComponent } from './query-result/query-result.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    AngularMaterialModule
  ],
  declarations: [
    // QueryCreateComponent,
    HomeComponent,
    QueryNoResultComponent,
    QueryResultComponent
  ]
})
export class HomeModule { }
