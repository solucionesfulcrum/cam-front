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
import { AfiliadosComponent } from './component/sub-component/afiliados/afiliados.component';
import { TalleresComponent } from './component/sub-component/talleres/talleres.component';
import { TalleristasComponent } from './component/sub-component/talleristas/talleristas.component';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [
    AdmUoComponent,
    AdmCiramComponent,
    RegistroComponent,
    EditComponent,
    EditCiramComponent,
    AfiliadosComponent,
    TalleresComponent,
    TalleristasComponent
  ],
  imports: [
    CommonModule,
    AdmOuRoutingModule,
    SharedModule,
    MaterialModule,
    MenuOpcionesComponent,
    CdkTableModule,
  ]
})
export class AdmUoModule { }
