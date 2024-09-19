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
import { ModalAsistenciaRestringidaComponent } from './components/sub-components/dialogs/modal-asistencia-restringida/modal-asistencia-restringida.component';
import { ModalAsistenciaRepetidaComponent } from './components/sub-components/dialogs/modal-asistencia-repetida/modal-asistencia-repetida.component';
import { MatAutocompleteScrollDirective } from 'src/app/directivas/mat-autocomplete-scroll.directive';
import { ControlTalleristaComponent } from './components/control-tallerista/control-tallerista.component';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { ControlTalleristaSesionesComponent } from './components/control-tallerista-sesiones/control-tallerista-sesiones.component';
import { InscripcionModalTalleristaComponent } from './modals/inscripcion-modal-tallerista/inscripcion-modal-tallerista.component';
import { InscripcionTalleristaControlService } from 'src/app/events/control/inscripcion-tallerista-control.service';
import { AsistenciaRapidaListaComponent } from './components/asistencia-rapida-lista/asistencia-rapida-lista.component';
import { CrearCabeceraAsistenciaRapidaComponent } from './components/crear-cabecera-asistencia-rapida/crear-cabecera-asistencia-rapida.component';


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
    ModalEditarComponent,
    ModalAsistenciaRestringidaComponent,
    ModalAsistenciaRepetidaComponent,
    MatAutocompleteScrollDirective,
    ControlTalleristaComponent,
    ControlTalleristaSesionesComponent,
    InscripcionModalTalleristaComponent,
    AsistenciaRapidaListaComponent,
    CrearCabeceraAsistenciaRapidaComponent,
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
    MenuOpcionesV2Component,
    DataLoadingComponent
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    InscripcionTalleristaControlService
  ],
})
export class ControlModule { }
