import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfiliadosLayoutComponent } from './afiliados-layout.component';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';

//import { SubListActivacionesUserComponent } from './show-user/sub-list-activaciones-user/sub-list-activaciones-user.component';

const routes: Routes = [
  
  { 
    path: 'analisis', 
    component: AnalisisComponent,
  },
  { 
    path: 'solicitudes', 
    component: SolicitudesComponent,
  },
  { 
    path: 'afiliados', 
    component: AfiliadosComponent,
  },
  { 
    path: 'evaluacion', 
    component: EvaluacionComponent,
  },

  { 
    path: '', 
    component: AfiliadosComponent,
    pathMatch: 'full',
    
  },
      /*children:[
      {path: '', component: AfiliadosComponent},
      {path: 'analisis', component: AnalisisComponent},
    ],*/
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfiliadosRoutingModule {}



