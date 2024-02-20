import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionComponent } from './admission/admission.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { CitasComponent } from './components/citas/citas.component';
import { FichaAdmisionComponent } from './components/ficha-admision/ficha-admision.component';
import { ShowFichaAdmisionComponent } from './components/ficha-admision/sub-components/show-ficha-admision/show-ficha-admision.component';
import { EditFichaAdmisionComponent } from './components/ficha-admision/sub-components/edit-ficha-admision/edit-ficha-admision.component';
import { PostulacionFichaAdmisionComponent } from './components/ficha-admision/sub-components/postulacion-ficha-admision/postulacion-ficha-admision.component';
import { CitaDetalleComponent } from './components/citas/sub-components/cita-detalle/cita-detalle.component';
import { CitaProgramacionComponent } from './components/citas/sub-components/cita-programacion/cita-programacion.component';
import { TabCitaActividadesComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-actividades/tab-cita-actividades.component';
import { TabCitaHistorialComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-historial/tab-cita-historial.component';
import { HistorialVisualizacionComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-historial/historial-visualizacion/historial-visualizacion.component';

const routes: Routes = [
  {
    path: '',
    component: AdmissionComponent,
    children:[
      {
        path: '',
        component: FichaAdmisionComponent,
        title: 'Registros de Fichas de Admisión'
      },
      {
        path: 'turnos',
        component: TurnosComponent,
        title: 'Registros de Turnos'
      },
      {
        path: 'citas',
        component: CitasComponent,
        title: 'Registros de Citas Registradas'
      },
      {
        path: ':id',
        component: ShowFichaAdmisionComponent,
        title: 'Datos Ficha de admisión'
      },
    ]
  },
  // Rutas para Fichas de admisión -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  {
    path: 'postulacion/:tipoDoc/:numDoc',
    component: PostulacionFichaAdmisionComponent,
    title: 'Registrar ficha de admisión'
  },
  {
    path: 'edit/:id',
    component: EditFichaAdmisionComponent,
    title: 'Editar ficha de admisión'
  },
  // Rutas para Citas ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  {
    path: 'citas/:idHist',
    component: CitaDetalleComponent,
    children:[
      {
        path: '',
        component: TabCitaActividadesComponent,
        title: 'Citas de la ficha de admisión'
      },
      {
        path: 'historial',
        component: TabCitaHistorialComponent,
        title: 'Historial de citas de la ficha de admisión'
      },
    ]
  },
  {
    path: 'citas/:idHist/programacion-cita/:id',
    component: CitaProgramacionComponent,
    title: 'Programar atención'
  },
  {
    path: 'citas/:idHist/historial/:idCita',
    component: HistorialVisualizacionComponent,
    title: 'Ver historial de atención'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionRoutingModule { }
