import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { HomeComponent } from './home/home/home.component';
// import { SignupComponent } from './users/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertComponent } from './insert-data/insert/insert.component';
import { MakePaymentComponent } from './payments/make-payment/make-payment.component';

/* ........... NOTE .............*/
/* Use AdminGuard instead of AuthGuard in */
/* case of extra login response */

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'insertdata', component: InsertComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: 'payment', component: MakePaymentComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AdminGuard,
    AuthGuard
  ]
})
export class AppRoutingModule { }

