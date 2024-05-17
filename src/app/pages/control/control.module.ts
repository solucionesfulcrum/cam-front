import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control/control.component';
import { ProgramadosComponent } from './components/programados/programados.component';
import { TabMisTalleresComponent } from './components/tab-mis-talleres/tab-mis-talleres.component';
import { TabAsistenciaComponent } from './components/tab-asistencia/tab-asistencia.component';
import { InscripcionModalComponent } from './modals/inscripcion-modal/inscripcion-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from 'src/app/material/material.module';
import { TabAsistenciaProfCamComponent } from './components/tab-asistencia-prof-cam/tab-asistencia-prof-cam.component';


@NgModule({
  declarations: [
    ControlComponent,
    ProgramadosComponent,
    TabMisTalleresComponent,
    TabAsistenciaComponent,
    InscripcionModalComponent,
    TabAsistenciaProfCamComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule,
    MaterialModule,
    MatAutocompleteModule,
  ]
})
export class ControlModule { }
