import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserData } from '../user-data.model';

@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.component.html',
  styleUrls: ['./users-info.component.css']
})
export class UsersInfoComponent implements OnInit {
  user: UserData;
  userfound = false;

  searchForm: FormGroup;

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
        }, error => {
          console.log(error);
        });
    }
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

      }, error => {
        console.log(error);
      });
  }

  toModifyUrl() {
    this.router.navigate(['/users/modify',
      {
        username: this.searchForm.get('username').value
      }
    ]);
  }
}
