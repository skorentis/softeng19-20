import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { QueriesService } from '../home/queries.service';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<{
    authenticated: boolean,
    currentUser: string
  }>();
  private currentUser: string;

  /* In case of extra response */
  // private isAdmin = false;
  // private adminStatusListener = new Subject<boolean>();
  // private quota: number;
  // private quotaListener = new Subject<number>();
  /* Was in case of extra response */

  private token: string;
  private tokenTimer: any;

  constructor(private router: Router, private http: HttpClient, private queriesService: QueriesService) {}

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return {
      authenticated: this.isAuthenticated,
      currentUser: this.currentUser
    };
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /* In case of extra response */
  // getQuota() {
  //   return this.quota;
  // }
  // getAdminStatusListener() {
  //   return this.adminStatusListener.asObservable();
  // }
  // getQuotaListener() {
  //   return this.quotaListener.asObservable();
  // }
  // getAdminStatus() {
  //   return this.isAdmin;
  // }
  /* Was in case of extra response */

  // signup(username: string, email, password: string) {
  //   const authData: AuthData = { username: username, email: email ? email : null, password: password};

  //   // Http POST req to the API
  //   // this.isAuthenticated = true;
  //   // this.authStatusListener.next(true);
  //   // this.router.navigate(['/home'])

  //   console.log('Username: ' + username + ', Email: ' + email + ', password: ' + password);
  //   this.http
  //     .post('http://localhost:3000/api/users/signup', authData)
  //     .subscribe(() => {
  //       this.router.navigate(['/signup']);
  //     }, error => {
  //       this.authStatusListener.next(false);
  //     });
  // }

  login(username: string, password: string) {
    const authData: AuthData = {username: username, permission: null, password: password};
    this.http
    .post<{
      token: string
      /* Extra response */
      // expiresIn: number,
      // userPermission: string,
      // quota: number
      }>
      ('https://localhost:8765/energy/api/Login', authData)
    .subscribe(response => {
      const token = response.token;
      this.currentUser = username;
      this.token = token;
      if (token) {
        /* This is for extra response */
        // const expiresInDuration = response.expiresIn;

        // const permission = response.userPermission;
        // this.isAdmin = permission === 'admin';

        // const quota = response.quota;
        // this.quota = quota;

        // this.adminStatusListener.next(permission === 'admin');
        // this.quotaListener.next(quota);
        /* This was for extra response */

        /* This is in case of no extra response */
        const expiresInDuration = 3600;
        /* This was in case of no extra response */

        this.isAuthenticated = true;
        this.authStatusListener.next({
          authenticated: true,
          currentUser: this.currentUser
        });

        this.setAuthTimer(expiresInDuration);
        const nowTimeStamp = new Date();
        const expirationDate = new Date(nowTimeStamp.getTime() + expiresInDuration * 1000);
        this.saveAuthData(username, token, expirationDate);
        this.router.navigate(['/home']);
      }
    }, error => {
      this.authStatusListener.next({
        authenticated: false,
        currentUser: null
      });
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next({
      authenticated: false,
      currentUser: null
    });

    /* In case of extra response */
    // this.isAdmin = false;
    // this.adminStatusListener.next(false);
    // this.quota = 0;
    // this.quotaListener.next(0);
    /* Was in case of extra response */

    this.token = null;
    clearTimeout(this.tokenTimer);

    this.queriesService.clearResults();
    this.queriesService.clearQueryFields();
    this.clearAuthData();
    this.queriesService.clearResultDataAndQueryFields();
    this.router.navigate(['/login']);
  }

  /* For user to get auto logged in when revisiting the page if
  token hasn't expired yet */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return; // In case of no Info (no user) then just return
    }
    const nowTimeStamp = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - nowTimeStamp.getTime();
    if (expiresIn > 0) {
      this.currentUser = authInformation.currentUser;
      this.token = authInformation.token;
      this.isAuthenticated = true;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next({
        authenticated: true,
        currentUser: this.currentUser
      });
    }
  }

  /* Set the authentication timer for FrontEnd logout */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /* Save token and expiration Date to the Browser's Local Storage */
  private saveAuthData(username: string, token: string, expirationDate: Date) {
    localStorage.setItem('currentUser', username);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  /* Delete the token and expiration Date from the Local Storage */
  private clearAuthData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  /* Get the token and expiration Date from the Local Storage */
  private getAuthData() {
    const currentUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    } else {
      return {
        currentUser: currentUser,
        token: token,
        expirationDate: new Date(expirationDate)
      }
    }
  }

}
