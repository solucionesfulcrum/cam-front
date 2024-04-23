import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component';

const routes: Routes = [
  {
    path: '',
    title: 'Elija la Unidad Operativa',
    component: SelectUnidOperativaComponent
  },
  {
    path: AppRoute.EDIT_USER,
    title: 'Editar Usuario',
    component: EditActiveUserComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionUsuarioRoutingModule { }
