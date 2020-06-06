import { AuthService } from '../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  // private authStatusSub: Subscription;

  hide1 = true;
  hide2 = true;
  // hide3 = true;

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthStatusListener()
    //   .subscribe(authStatus => {
    //     this.isLoading = false;
    //   });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.usersService.createUser(form.value.username, form.value.password, form.value.email, form.value.quota);
  }

  ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  }

}
