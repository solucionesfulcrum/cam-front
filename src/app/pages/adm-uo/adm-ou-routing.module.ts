import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdmUoComponent } from './adm-uo/adm-uo.component'
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component'

const routes: Routes = [
  {path: '',
    component: AdmUoComponent,
    children: [
      {
        path: '',
        component: AdmCiramComponent,
        title: 'Dashboard - Afiliados'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmOuRoutingModule { }
