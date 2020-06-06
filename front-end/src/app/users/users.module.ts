import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../angular-material.module';
import { UsersRoutingModule } from './users-routing.module';

import { SignupComponent } from './signup/signup.component';
import { UsersInfoComponent } from './users-info/users-info.component';
import { UsersComponent } from './users/users.component';
import { UsersEmptyComponent } from './user-empty/users-empty.component';
import { UserUpdateComponent } from './user-update/user-update.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    UsersRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SignupComponent,
    UsersInfoComponent,
    UsersComponent,
    UsersEmptyComponent,
    UserUpdateComponent
  ]
})
export class UsersModule { }
