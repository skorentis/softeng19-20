import { Component, OnInit } from '@angular/core';
import { QueriesService } from './home/queries.service';
import * as smoothscroll from 'smoothscroll-polyfill';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'softeng2019';

  constructor(private queriesService: QueriesService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
    this.queriesService.autoGetResultDataAndQueryFields();
    smoothscroll.polyfill();
  }
}
