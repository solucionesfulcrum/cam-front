import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmUoComponent } from './adm-uo/adm-uo.component';
import { AdmOuRoutingModule } from './adm-ou-routing.module';
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component';
import { SharedModule } from '@shared/shared.module';
import { RegistroComponent } from './component/registro/registro.component';
import { EditComponent } from './component/edit/edit.component';
import { MaterialModule } from 'src/app/material/material.module';
import { EditCiramComponent } from './component/edit-ciram/edit-ciram.component';
import { MenuOpcionesComponent } from '@shared/components/menu-opciones/menu-opciones.component';

@NgModule({
  declarations: [
    AdmUoComponent,
    AdmCiramComponent,
    RegistroComponent,
    EditComponent,
    EditCiramComponent
  ],
  imports: [
    CommonModule,
    AdmOuRoutingModule,
    SharedModule,
    MaterialModule,
    MenuOpcionesComponent
  ]
})
export class AdmUoModule { }
