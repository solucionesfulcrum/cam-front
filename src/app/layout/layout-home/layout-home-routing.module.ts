import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutHomeComponent } from './layout-home.component'
import { AuthGuard } from '../../guards/auth.guard';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { SelectUnidOperativaComponent } from 'src/app/pages/administracion-usuario/select-unid-operativa/select-unid-operativa.component';
//import { AdministracionUsuarioModule } from '../../pages/administracion-usuario/administracion-usuario.module'

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutHomeComponent,
    children: [
      {
        path: 'users',
        canActivate: [AuthGuard],
        title: 'Lista de usuarios',
        loadChildren: () =>
          import('../../pages/users/users.module').then((m) => m.UsersModule),
      }, {
        path: 'uo',
        title: 'CAM - OU',
        canActivate: [AuthGuard],
        component: SelectUnidOperativaComponent,
        //loadChildren: () => import('../../pages/administracion-usuario/administracion-usuario.module').then((m) => m.AdministracionUsuarioModule),
      }
      /*{
        path: AppRoute.EDIT_USER,
        title: 'Editar Usuario',
        component: EditActiveUserComponent,
      }*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutHomeRoutingModule { }
