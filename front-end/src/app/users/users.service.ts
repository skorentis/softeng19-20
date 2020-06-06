import { Injectable } from '@angular/core';
import { UserData } from './user-data.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn : 'root'})
export class UsersService {

  constructor(private router: Router, private http: HttpClient) {}

  createUser(username: string, password: string, email: string, quota: string) {
    const userData = {
      username: username,
      password: password,
      email: email,
      quota: quota
    };
    this.http
      .post<{newUser: string, newDoc}>('https://localhost:8765/energy/api/Admin/users', userData)
      .subscribe(response => {
        console.log(response.newDoc);
        this.router.navigate(['/users/user',
          {
            username: username
          }
        ]);
      }, error => {
        console.log(error);
        // this.router.navigate(['/users/signup']);
      });

  }

  findUsersDetails(username: string) {
    return this.http
      .get<{
        username: string;
        password: string;
        email: string;
        permission: string;
        quota: string;
        quota_limit: string;
      }>('https://localhost:8765/energy/api/Admin/users/' + username);
  }

  modifyUsersDetails(username: string, password: string, email: string, permission: string, quota: string, quotaLimit: string) {
    const userData = {
      password: password,
      email: email,
      permission: permission,
      quota: quota,
      quota_limit: quotaLimit
    };
    return this.http
      .put('https://localhost:8765/energy/api/Admin/users/' + username, userData);
  }

  deleteUser(username: string) {
    this.http
      .delete('https://localhost:8765/energy/api/Admin/users/delete', );
  }
}
