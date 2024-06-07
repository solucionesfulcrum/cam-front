import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdmUoComponent } from './adm-uo/adm-uo.component';
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component';
import { RegistroComponent } from './component/registro/registro.component';
import { ShowComponent } from './component/show/show.component'
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { EditCiramComponent } from './component/edit-ciram/edit-ciram.component'
import { AfiliadosComponent } from './component/sub-component/afiliados/afiliados.component';
import { TalleresComponent } from './component/sub-component/talleres/talleres.component';
import { TalleristasComponent } from './component/sub-component/talleristas/talleristas.component';

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
        path: `show/:idUnidadOperativa`,
        component: ShowComponent,
        title: 'Editar - CAM',
        children:[
            {
              path: '',
              component: AfiliadosComponent,
            },
            {
              path: 'afiliados',
              component: AfiliadosComponent,
            },
            {
              path: 'talleres',
              component: TalleresComponent,
            },
            {
              path: 'talleristas',
              component: TalleristasComponent,
            }
        ]
      },
      {
        path: `${AppRoute.EDIT_CIRAM}/:idUnidadOperativa`,
        component: EditCiramComponent,
        title: 'Editar - CIRAM',
        
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmOuRoutingModule { }
