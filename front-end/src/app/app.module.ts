import { HttpClientModule, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { InsertDataModule } from './insert-data/insert-data.module';
import { AngularMaterialModule } from './angular-material.module';

import { LoginComponent } from './auth/login/login.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';

import { RequestsInterceptor } from './requests-interceptor';
import { PaymentModule } from './payments/payment.module';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { HttpErrorComponent } from './http-error/http-error.component';
import { MycomponentComponent } from './mycomponent/mycomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    HeaderComponent,
    HttpErrorComponent,
    MycomponentComponent
  ],
  imports: [
    HomeModule,
    UsersModule,
    PaymentModule,
    InsertDataModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  entryComponents: [HttpErrorComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
