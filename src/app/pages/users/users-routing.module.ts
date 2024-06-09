import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ListComponent } from './list/list.component';
import { RolesComponent } from './roles/roles.component';
import { ShowComponent } from './show/show.component';
import { ShowRoleComponent } from './show-role/show-role.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children:[
      {
        path:'',
        component:ListComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'roles/:roleId',
        component: ShowRoleComponent,
      },
      {
        path: ':id',
        component: ShowComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
