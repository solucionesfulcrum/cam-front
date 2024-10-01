import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ListComponent } from './list/list.component';
import { RolesComponent } from './roles/roles.component';
import { ShowComponent } from './show/show.component';
import { ShowRoleComponent } from './show-role/show-role.component';
import { ShowRoleDetalleComponent } from './show-role-detalle/show-role-detalle.component';
import { ListaServiciosRolComponent } from './componentes/lista-servicios-rol/lista-servicios-rol.component';

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
        component: ShowRoleDetalleComponent,
        children: [
          {
            path: '',
            component: ListaServiciosRolComponent
          }
        ]
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
