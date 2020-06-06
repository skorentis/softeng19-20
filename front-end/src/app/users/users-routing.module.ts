import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { UsersInfoComponent } from './users-info/users-info.component';
import { UsersComponent } from './users/users.component';
import { UsersEmptyComponent } from './user-empty/users-empty.component';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateComponent } from './user-update/user-update.component';

const usersRoutes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: '',
        component: UsersEmptyComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'signup',
        component: SignupComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'user',
        component: UsersInfoComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'modify',
        component: UserUpdateComponent,
        canActivate: [AuthGuard, AdminGuard]
      }
    ]
  }


];

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdminGuard,
    AuthGuard
  ]
})
export class UsersRoutingModule { }
