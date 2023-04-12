import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { SubListActivacionesUserComponent } from './show-user/sub-list-activaciones-user/sub-list-activaciones-user.component';
import { RolesComponent } from './roles/roles.component';
import { ShowRoleComponent } from './show-role/show-role.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

const routes: Routes = [
  // { path: '', component: CamsComponent},
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'show/:id',
    component: ShowUserComponent,
    children: [
      {
        path: '',
        redirectTo: 'activaciones',
        pathMatch: 'full',
      },
      {
        path: 'activaciones',
        component: SubListActivacionesUserComponent,
      },
      {
        path: '**',
        redirectTo: 'activaciones',
      },
    ],
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'roles/show/:id',
    component: ShowRoleComponent,
    
  },
  {
    path: 'edit/:id',
    component: EditUserComponent,
  },
  {
    path: 'new',
    component: NewUserComponent,
  },
  {
    path: 'roles/new',
    component: NewRoleComponent,
  },
  {
    path: 'roles/edit/:id',
    component: EditRoleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}