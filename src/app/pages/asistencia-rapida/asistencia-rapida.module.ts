import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsistenciaRapidaRoutingModule } from './asistencia-rapida-routing.module';
import { AsistenciaRapidaComponent } from './asistencia-rapida/asistencia-rapida.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { TalleristasAsistenciaRapidaComponent } from './components/talleristas-asistencia-rapida/talleristas-asistencia-rapida.component';
import { ProfCamAsistenciaRapidaComponent } from './components/prof-cam-asistencia-rapida/prof-cam-asistencia-rapida.component';


@NgModule({
  declarations: [
    AsistenciaRapidaComponent,
    TalleristasAsistenciaRapidaComponent,
    ProfCamAsistenciaRapidaComponent
  ],
  imports: [
    CommonModule,
    AsistenciaRapidaRoutingModule,
    CdkTableModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MaterialModule,
    ReactiveFormsModule,
    DialogModule,
    DataLoadingComponent
  ]
})
export class AsistenciaRapidaModule { }
