import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control/control.component';
import { ProgramadosComponent } from './components/programados/programados.component';


@NgModule({
  declarations: [
    ControlComponent,
    ProgramadosComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule
  ]
})
export class ControlModule { }
