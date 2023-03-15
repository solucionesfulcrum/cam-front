import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionLayoutComponent } from './planificacion-layout.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NuevoProfesionalComponent } from './componentes/nuevo-profesional/nuevo-profesional.component';
import { EditProfesionalComponent } from './componentes/edit-profesional/edit-profesional.component';
import { VerParticipantesComponent } from './eventos/ver-participantes/ver-participantes.component';
import { DetalleParticipanteComponent } from './eventos/modals/detalle-participante/detalle-participante.component';
import { NuevoCiramComponent } from './cirams/nuevo-ciram/nuevo-ciram.component';
import { EditCiramComponent } from './cirams/edit-ciram/edit-ciram.component';
import { NuevoTalleristaComponent } from './talleristas/nuevo-tallerista/nuevo-tallerista.component';
import { EditTalleristaComponent } from './talleristas/edit-tallerista/edit-tallerista.component';



@NgModule({
  declarations: [
    PlanificacionLayoutComponent,
    NuevoProfesionalComponent,
    EditProfesionalComponent,
    VerParticipantesComponent,
    DetalleParticipanteComponent,
    NuevoCiramComponent,
    EditCiramComponent,
    NuevoTalleristaComponent,
    EditTalleristaComponent,
    
  ],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTabsModule
  ]
})
export class PlanificacionModule { }
