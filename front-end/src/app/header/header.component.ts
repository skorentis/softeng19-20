import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { QueriesService } from '../home/queries.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  currentUsername: string;
  private authListenerSubs: Subscription;

  resultsExist: boolean;
  private resultsListenerSub: Subscription;

  navMenuOpen = true;
  previousScreenSize = 'desktop';

  /* In case of extra response */
  // userIsAdmin = false;
  // quota: number;
  // private adminListenerSubs: Subscription;
  // private quotaListenerSubs: Subscription;
  /* Was in case of extra response */

  constructor(private authService: AuthService, private queriesService: QueriesService) { }

  ngOnInit() {
    const authInfo = this.authService.getAuthStatus();
    this.userIsAuthenticated = authInfo.authenticated;
    this.currentUsername = authInfo.currentUser;
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated.authenticated;
        this.currentUsername = isAuthenticated.currentUser;
        // if (!isAuthenticated) {
        //   this.resultsExist = false;
        // }
      });
    this.resultsExist = this.queriesService.getResultsExist();
    this.resultsListenerSub = this.queriesService.getResultsExistSubject()
      .subscribe(resultsExist => {
        this.resultsExist = resultsExist;
      })

    /* In case of extra response */
    // this.userIsAdmin = this.authService.getAdminStatus();
    // this.quota = this.authService.getQuota();
    // this.adminListenerSubs = this.authService.getAdminStatusListener()
    //   .subscribe(isAdmin => {
    //     this.userIsAdmin = isAdmin;
    //   });
    // this.quotaListenerSubs = this.authService.getQuotaListener()
    //   .subscribe(quota => {
    //     this.quota = quota;
    //   });
    /* Was in case of extra response */
  }

  onNavMenuToggle() {
    this.navMenuOpen = !this.navMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 750) {
      if (this.previousScreenSize === 'desktop') {
        this.navMenuOpen = false;
        this.previousScreenSize = 'small-screen';
      }
    } else {
      this.previousScreenSize = 'desktop';
      this.navMenuOpen = true;
    }
  }

  onTeamRocketLogo() {
    // if (this.queriesService.resultsExist) {
    //   this.resultsExist = true;
    //   console.log(this.queriesService.resultsExist, this.resultsExist)
    // } else {
    //   this.resultsExist = false;
    //   console.log(this.queriesService.resultsExist, this.resultsExist)
    // }

  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.resultsListenerSub.unsubscribe();
    /* In case of extra response */
    // this.adminListenerSubs.unsubscribe();
    // this.quotaListenerSubs.unsubscribe();
    /* Was in case of extra response */
  }
}
