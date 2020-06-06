import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  activeItem: string;

  navLinks = [
    {
      label: 'Add a new user',
      path: './signup',
      icon: 'person_add'
    },
    {
      label: 'Find user\'s info',
      path: './user',
      icon: 'info'
    },
    {
      label: 'Modify user\'s info',
      path: './modify',
      icon: 'edit'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  setActiveItem(page: string) {
    this.activeItem = page;
  }

}
