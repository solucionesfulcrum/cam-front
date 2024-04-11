import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmUoComponent } from './adm-uo/adm-uo.component';
import { AdmOuRoutingModule } from './adm-ou-routing.module';
import { AdmCiramComponent } from './component/adm-ciram/adm-ciram.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AdmUoComponent,
    AdmCiramComponent
  ],
  imports: [
    CommonModule,
    AdmOuRoutingModule,
    SharedModule
  ]
})
export class AdmUoModule { }
