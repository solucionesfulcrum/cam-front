import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ControlRoutingModule } from './control-routing.module';
import { ControlComponent } from './control/control.component';
import { ProgramadosComponent } from './components/programados/programados.component';
import { TabMisTalleresComponent } from './components/tab-mis-talleres/tab-mis-talleres.component';
import { TabAsistenciaComponent } from './components/tab-asistencia/tab-asistencia.component';
import { InscripcionModalComponent } from './modals/inscripcion-modal/inscripcion-modal.component';
import { MaterialModule } from 'src/app/material/material.module';
import { TabAsistenciaProfCamComponent } from './components/tab-asistencia-prof-cam/tab-asistencia-prof-cam.component';
import { DialogConfirmDataAsistenciaComponent } from './components/tab-asistencia/dialog/dialog-confirm-data-asistencia/dialog-confirm-data-asistencia.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkTableModule } from '@angular/cdk/table';
import { CalendarioProgramacionComponent } from './components/calendario-programacion/calendario-programacion.component';
import { ConfirmarProgramacionComponent } from './components/sub-components/dialogs/confirmar-programacion/confirmar-programacion.component';
import { DialogAddProgramacionAsignacionComponent } from './components/sub-components/dialogs/dialog-add-programacion-asignacion/dialog-add-programacion-asignacion.component';
import { CdkMenuModule } from '@angular/cdk/menu';


@NgModule({
  declarations: [
    ControlComponent,
    ProgramadosComponent,
    TabMisTalleresComponent,
    TabAsistenciaComponent,
    InscripcionModalComponent,
    TabAsistenciaProfCamComponent,
    DialogConfirmDataAsistenciaComponent,
    CalendarioProgramacionComponent,
    ConfirmarProgramacionComponent,
    DialogAddProgramacionAsignacionComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    SharedModule,
    MaterialModule,
    MatAutocompleteModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    CdkTableModule,
    CdkMenuModule
    
  ]
})
export class ControlModule { }
