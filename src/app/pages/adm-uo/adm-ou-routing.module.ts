import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdmUoComponent } from './adm-uo/adm-uo.component';
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component';
import { RegistroComponent } from './component/registro/registro.component';
import { EditComponent } from './component/edit/edit.component'

const routes: Routes = [
  {path: '',
    component: AdmUoComponent,
    children: [
      {
        path: '',
        component: AdmCiramComponent,
        title: 'Adm - CIRAM´S'
      },
      {
        path: 'registro',
        component: RegistroComponent,
        title: 'Registro - CIRAM'
      },
      {
        path: 'edit',
        component: EditComponent,
        title: 'Editar - CIRAM'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmOuRoutingModule { }
