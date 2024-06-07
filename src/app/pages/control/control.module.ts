import { LOCALE_ID, NgModule } from '@angular/core';
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
import { ModalConfirmarComponent } from './components/sub-components/dialogs/modal-confirmar/modal-confirmar.component';
import { ModalEditarComponent } from './components/sub-components/dialogs/modal-editar/modal-editar.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SelectPersonalizadoComponent } from '@shared/components/select-personalizado/select-personalizado.component';
import { MenuOpcionesV2Component } from '@shared/components/menu-opciones-v2/menu-opciones-v2.component';


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
    DialogAddProgramacionAsignacionComponent,
    ModalConfirmarComponent,
    ModalEditarComponent
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
    CdkMenuModule,
    SelectPersonalizadoComponent,
    MenuOpcionesV2Component
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
})
export class ControlModule { }
