import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component';
import { SidenavAdminUserComponent } from './sidenav-admin-user/sidenav-admin-user.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { SeguridadComponent } from './seguridad/seguridad.component';

const routes: Routes = [
  {
    path: '',
    title: 'Elija la Unidad Operativa',
    component: SelectUnidOperativaComponent
  },
  {
    path: AppRoute.EDIT_USER,
    component: SidenavAdminUserComponent,
    children:  [
      {
        path: '',
        component: EditActiveUserComponent,
        title: 'Información Personal'
      },
      {
        path: 'informacion-personal',
        component: EditActiveUserComponent,
        title: 'Información Personal'
      },
      {
        path: 'nivel-educativo',
        component: NivelEducativoComponent,
        title: 'Nivel Educativo'
      },
      {
        path: 'seguridad',
        component: SeguridadComponent,
        title: 'Seguridad'
      },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionUsuarioRoutingModule { }
