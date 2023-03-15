import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanificacionLayoutComponent } from './planificacion-layout.component';
import { NuevoProfesionalComponent } from './componentes/nuevo-profesional/nuevo-profesional.component';
import { EditProfesionalComponent } from './componentes/edit-profesional/edit-profesional.component';
import { VerParticipantesComponent } from './eventos/ver-participantes/ver-participantes.component';
import { NuevoCiramComponent } from './cirams/nuevo-ciram/nuevo-ciram.component';
import { EditCiramComponent } from './cirams/edit-ciram/edit-ciram.component';
import { NuevoTalleristaComponent } from './talleristas/nuevo-tallerista/nuevo-tallerista.component';
import { EditTalleristaComponent } from './talleristas/edit-tallerista/edit-tallerista.component';

const routes: Routes = [
  { path: '', component: PlanificacionLayoutComponent },
  { path: 'nuevo-profesional', component: NuevoProfesionalComponent },
  { path: 'nuevo-ciram', component: NuevoCiramComponent },
  { path: 'nuevo-tallerista', component: NuevoTalleristaComponent },

  { 
    path: 'edit-profesional', 
    title: 'NEditando profesional',
    component: EditProfesionalComponent 
  },
  { path: 'edit-ciram', component: EditCiramComponent },
  { path: 'edit-tallerista', component: EditTalleristaComponent },
  { path: 'evento/ver-participantes', component: VerParticipantesComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionRoutingModule {}
