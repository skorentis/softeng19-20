import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /* ................ NOTE ................ */
  /* In case of extra response include admin.guard.ts */
  /* to the app-routing.module.ts and users-routing.module.ts */
  /* and to the following routes /users/* , /insertdata */

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean|UrlTree> | Promise<boolean|UrlTree> {
    const isAdmin = this.authService.getAuthStatus().currentUser === 'admin';
    // const isAdmin = this.authService.getAdminStatus();
    if (!isAdmin) {
      alert('ADMIN ACCESS ONLY');
    }
    return isAdmin;
  }

}
