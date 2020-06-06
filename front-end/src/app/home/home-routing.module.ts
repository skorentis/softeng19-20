import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QueryNoResultComponent } from './query-no-result/query-no-result.component';
import { QueryResultComponent } from './query-result/query-result.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth/auth.guard';
import { HomeGuard } from '../auth/home.guard';

const queryRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: QueryNoResultComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'result',
        component: QueryResultComponent,
        canActivate: [AuthGuard, HomeGuard]
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(queryRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    HomeGuard
  ]
})
export class HomeRoutingModule { }
