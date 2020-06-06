import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserData } from '../user-data.model';
import { NgForm, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  user: UserData;
  userfound = false;

  searchForm: FormGroup;
  modifyForm: FormGroup;

  constructor(private usersService: UsersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    this.searchForm = new FormGroup({
      username: new FormControl(username ? username : null, [Validators.required])
    });
    if (username) {
      this.usersService.findUsersDetails(username)
        .subscribe(userdoc => {
          const user = userdoc;
          this.user = {
            username: user.username,
            password: user.password,
            email: user.email,
            permission: user.permission,
            quota: user.quota,
            quota_limit: user.quota_limit
          };
          this.userfound = true;
          this.modifyForm = new FormGroup({
            password: new FormControl(this.user.password, [Validators.required]),
            email: new FormControl(this.user.email, [Validators.required]),
            permission: new FormControl(this.user.permission, [Validators.required]),
            quota: new FormControl(this.user.quota, [Validators.required]),
            quota_limit: new FormControl(this.user.quota_limit, [Validators.required])
          });
        }, error => {
          this.userfound = false;
          console.log(error);
        });
    }
  }

  onModify() {
    if (this.modifyForm.invalid) {
      return;
    }

    this.usersService.modifyUsersDetails(
        this.user.username,
        this.modifyForm.get('password').value,
        this.modifyForm.get('email').value,
        this.modifyForm.get('permission').value,
        this.modifyForm.get('quota').value,
        this.modifyForm.get('quota_limit').value
      )
      .subscribe(result => {
        this.router.navigate(['/users/user',
          {
            username: this.user.username
          }
        ]);
      }, error => {
        console.log(error);
      });
  }

  onSearch() {
    this.usersService.findUsersDetails(this.searchForm.get('username').value)
      .subscribe(userdoc => {
        const user = userdoc;
        this.user = {
          username: user.username,
          password: user.password,
          email: user.email,
          permission: user.permission,
          quota: user.quota,
          quota_limit: user.quota_limit
        };
        this.userfound = true;

        this.modifyForm = new FormGroup({
          password: new FormControl(this.user.password, [Validators.required]),
          email: new FormControl(this.user.email, [Validators.required]),
          permission: new FormControl(this.user.permission, [Validators.required]),
          quota: new FormControl(this.user.quota, [Validators.required]),
          quota_limit: new FormControl(this.user.quota_limit, [Validators.required])
        });

      }, error => {
        this.userfound = false;
        alert(error)
      });
  }
}
