import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HorarioRoutingModule } from './horario-routing.module';
import { HorarioComponent } from './horario/horario.component';
import { HorarioAdministrarComponent } from './components/horario-administrar/horario-administrar.component';
import { HorarioBuscarComponent } from './components/horario-buscar/horario-buscar.component';
import { HorarioConfiguracionComponent } from './components/horario-configuracion/horario-configuracion.component';
import { SharedModule } from '@shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogModule } from '@angular/cdk/dialog';
import { HorarioCrearComponent } from './components/horario-administrar/sub-components/horario-crear/horario-crear.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfirmCreateHorarioComponent } from './components/horario-administrar/sub-components/dialogs/confirm-create-horario/confirm-create-horario.component';
import { HorarioProgramacionComponent } from './components/horario-administrar/sub-components/horario-programacion/horario-programacion.component';
import { DialogScheduleCalendarComponent } from './components/horario-administrar/sub-components/dialogs/dialog-schedule-calendar/dialog-schedule-calendar.component';
import { CdkMenuModule } from '@angular/cdk/menu';


@NgModule({
  declarations: [
    HorarioComponent,
    HorarioAdministrarComponent,
    HorarioBuscarComponent,
    HorarioConfiguracionComponent,
    HorarioCrearComponent,
    ConfirmCreateHorarioComponent,
    HorarioProgramacionComponent,
    DialogScheduleCalendarComponent
  ],
  imports: [
    CommonModule,
    HorarioRoutingModule,
    SharedModule,
    CdkTableModule,
    CdkMenuModule,
    FormsModule,
    MaterialModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    DialogModule
  ],
  providers: [
    DatePipe
  ]
})
export class HorarioModule { }
