import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  titulo: string='Lista de Usuarios';
  links=[
    {url:'/app/admin/users', title: 'Usuarios'},
    {url:'/app/admin/users/roles', title: 'Roles'},
  ]
}