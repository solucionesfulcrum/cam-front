import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control/control.component';
import { ProgramadosComponent } from './components/programados/programados.component';
import { TabMisTalleresComponent } from './components/tab-mis-talleres/tab-mis-talleres.component';
import { TabAsistenciaComponent } from './components/tab-asistencia/tab-asistencia.component';
<<<<<<< HEAD
import { InscripcionModalComponent } from './modals/inscripcion-modal/inscripcion-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from 'src/app/material/material.module';
import { TabAsistenciaProfCamComponent } from './components/tab-asistencia-prof-cam/tab-asistencia-prof-cam.component';
=======
import { DialogConfirmDataAsistenciaComponent } from './components/tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
>>>>>>> 335cf3e63b21806f83aea73b004a248643c60187


@NgModule({
  declarations: [
    ControlComponent,
    ProgramadosComponent,
    TabMisTalleresComponent,
    TabAsistenciaComponent,
<<<<<<< HEAD
    InscripcionModalComponent,
    TabAsistenciaProfCamComponent
=======
    DialogConfirmDataAsistenciaComponent
>>>>>>> 335cf3e63b21806f83aea73b004a248643c60187
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule,
<<<<<<< HEAD
    MaterialModule,
    MatAutocompleteModule,
=======
    MatAutocompleteModule
>>>>>>> 335cf3e63b21806f83aea73b004a248643c60187
  ]
})
export class ControlModule { }
