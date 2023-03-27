import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamsComponent} from './cams/cams.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { CiramsComponent } from './cirams/cirams.component';
import { EditCamComponent } from './edit-cam/edit-cam.component';
import { NewCamComponent } from './new-cam/new-cam.component';
import { ProgramasComponent } from './programas/programas.component';
import { RedesComponent } from './redes/redes.component';
import { ShowCamComponent } from './show-cam/show-cam.component';
import { SubListCiramsCamComponent } from './show-cam/sub-list-cirams-cam/sub-list-cirams-cam.component';
import { SubListProgramasCamComponent } from './show-cam/sub-list-programas-cam/sub-list-programas-cam.component';
import { SubListUsuariosCamComponent } from './show-cam/sub-list-usuarios-cam/sub-list-usuarios-cam.component';
import { SubViewCiramsCamComponent } from './show-cam/sub-view-cirams-cam/sub-view-cirams-cam.component';
import { SubViewProgramasCamComponent } from './show-cam/sub-view-programas-cam/sub-view-programas-cam.component';
import { SubViewUsuariosCamComponent } from './show-cam/sub-view-usuarios-cam/sub-view-usuarios-cam.component';
import { UbigeosComponent } from './ubigeos/ubigeos.component';
import { ShowCiramComponent } from './show-ciram/show-ciram.component';
import { SubListProgramasCiramComponent } from './show-ciram/sub-list-programas-ciram/sub-list-programas-ciram.component';
import { SubViewProgramasCiramComponent } from './show-ciram/sub-view-programas-ciram/sub-view-programas-ciram.component';
import { SubListUsuariosCiramComponent } from './show-ciram/sub-list-usuarios-ciram/sub-list-usuarios-ciram.component';
import { SubViewUsuariosCiramComponent } from './show-ciram/sub-view-usuarios-ciram/sub-view-usuarios-ciram.component';
import { EditCiramComponent } from './edit-ciram/edit-ciram.component';
import { NewCiramComponent } from './new-ciram/new-ciram.component';
import { NewServicioComponent } from './new-servicio/new-servicio.component';
import { EditServicioComponent } from './edit-servicio/edit-servicio.component';
import { ShowServicioComponent } from './show-servicio/show-servicio.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

const routes: Routes = [
 // { path: '', component: CamsComponent},
 {
    path: '',
    component:  CamsComponent,
  },
  /*
  {
    path: 'cams',
    component: CamsComponent,
  }, 
  */
  {
    path: 'servicios',
    component: ServiciosComponent,
  }, 
  {
    path: 'programas',
    component: ProgramasComponent,
  }, 
  {
    path: 'redes',
    component: RedesComponent,
  }, 
  {
    path: 'ubigeos',
    component: UbigeosComponent,
  }, 
  {
    path: 'show/:id',
    component: ShowCamComponent,
    children: [
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },
      {
        path: 'programas',
        component:SubListProgramasCamComponent
      },
      {
        path: 'programas/:sid',
        component:SubViewProgramasCamComponent
      },
      {
        path: 'cirams',
        component:SubListCiramsCamComponent
      },
      {
        path: 'cirams/:sid',
        component:SubViewCiramsCamComponent
      },
      {
        path: 'usuarios',
        component:SubListUsuariosCamComponent
      },
      {
        path: 'usuarios/:sid',
        component:SubViewUsuariosCamComponent
      },
      {
        path:'**',
        redirectTo:'programas'
      },
    ],
  }, 
  {
    path: 'cirams',
    component: CiramsComponent,
  }, 
  {
    path: 'cirams/show/:id',
    component: ShowCiramComponent,
    children: [
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },
      {
        path: 'programas',
        component: SubListProgramasCiramComponent
      },
      {
        path: 'programas/:sid',
        component: SubViewProgramasCiramComponent
      },
      {
        path: 'usuarios',
        component: SubListUsuariosCiramComponent 
      },
      {
        path: 'usuarios/:sid',
        component: SubViewUsuariosCiramComponent
      },
      {
        path:'**',
        redirectTo:'programas'
      },
    ],
  }, 
  {
    path: 'edit/:id',
    component: EditCamComponent,
  }, 
  {
    path: 'new',
    component: NewCamComponent,
  }, 
  {
    path: 'cirams/new',
    component: NewCiramComponent,
  }, 
  {
    path: 'cirams/edit/:id',
    component: EditCiramComponent,
  }, 
  {
    path: 'servicios/new',
    component: NewServicioComponent,
  }, 
  {
    path: 'servicios/edit/:id',
    component: EditServicioComponent,
  }, 


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamsRoutingModule {}
