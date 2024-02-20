import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contacto/contacto.component';
import { ContactoProfesionalesComponent } from './components/contacto-profesionales/contacto-profesionales.component';
import { ContactoRpsUsersComponent } from './components/contacto-rps-users/contacto-rps-users.component';
import { ContactoAliadosComponent } from './components/contacto-aliados/contacto-aliados.component';
import { ContactoSubDetalleProfesionalComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/contacto-sub-detalle-profesional.component';
import { TabContactoDetalleHorariosComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/tabs/tab-contacto-detalle-horarios/tab-contacto-detalle-horarios.component';
import { TabContactoDetalleParametrosComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/tabs/tab-contacto-detalle-parametros/tab-contacto-detalle-parametros.component';

const routes: Routes = [
  {
    path: '',
    component: ContactoComponent,
    children:[
      {
        path: '',
        component: ContactoProfesionalesComponent,
        title: 'Registros de profesionales'
      },
      {
        path: 'rps-users',
        component: ContactoRpsUsersComponent,
        title: 'Registros de Usuarios RPS'
      },
      {
        path: 'allies',
        component: ContactoAliadosComponent,
        title: 'Registros de Aliados'
      },
      {
        path: ':idProfesional',
        component: ContactoSubDetalleProfesionalComponent,
        children:[
          {
            path: '',
            component: TabContactoDetalleParametrosComponent,
            title: 'Datos del Profesional',
          },
          {
            path: 'horarios',
            component: TabContactoDetalleHorariosComponent,
            title: 'Horarios del Profesional',
          }
        ]
      },
      {
        path: ':idProfesional/edit',
        component: ContactoSubDetalleProfesionalComponent,
        children:[
          {
            path: '',
            component: TabContactoDetalleParametrosComponent,
            title: 'Edición de datos del Profesional',
          },
          {
            path: 'horarios',
            component: TabContactoDetalleHorariosComponent,
            title: 'Edición de horarios del Profesional',
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoRoutingModule { }
