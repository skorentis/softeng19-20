import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { QueriesService } from '../home/queries.service';

@Injectable()
export class HomeGuard implements CanActivate {
  constructor(private queriesService: QueriesService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean|UrlTree> | Promise<boolean|UrlTree> {
    const resultsExist = this.queriesService.getResultsExist();
    // const isAdmin = this.authService.getAdminStatus();
    if (!resultsExist) {
      this.router.navigate(['/home']);
    }
    return resultsExist;
  }

}
