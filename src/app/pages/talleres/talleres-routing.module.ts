import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalisisComponent} from './analisis/analisis.component';
import { ProgramacionComponent } from './programacion/programacion.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { CiramsComponent } from './cirams/cirams.component';
import { TalleristasComponent } from './talleristas/talleristas.component';
import { ShowProgramacionTallerComponent } from './show-programacion-taller/show-programacion-taller.component';

const routes: Routes = [
  // { path: '', component: CamsComponent},
  {
    path: '',
    component: AnalisisComponent,
  },
  {
    path:'analisis',
    component:AnalisisComponent,
  },
  {
    path:'servicios',
    component:ServiciosComponent,
  },
  {
    path:'cirams',
    component:CiramsComponent
  },
  {
    path:'talleristas',
    component:TalleristasComponent
  },
  {
    path:'programacion',
    component:ProgramacionComponent,
    children:[
      {
        path: ':id',
        component:  ShowProgramacionTallerComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalleresRoutingModule {}
