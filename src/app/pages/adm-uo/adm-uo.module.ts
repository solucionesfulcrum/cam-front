import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmUoComponent } from './adm-uo/adm-uo.component';
import { AdmOuRoutingModule } from './adm-ou-routing.module';
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component';
import { SharedModule } from '@shared/shared.module';
import { RegistroComponent } from './component/registro/registro.component';
import { EditComponent } from './component/edit/edit.component';


@NgModule({
  declarations: [
    AdmUoComponent,
    AdmCiramComponent,
    RegistroComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    AdmOuRoutingModule,
    SharedModule
  ]
})
export class AdmUoModule { }
