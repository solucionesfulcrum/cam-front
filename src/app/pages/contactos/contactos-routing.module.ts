import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactosAfiliadosComponent } from './components/contactos-afiliados/contactos-afiliados.component';
import { ContactosTalleristasComponent } from './components/contactos-talleristas/contactos-talleristas.component';
import { ShowAfiliadoComponent } from './components/contactos-afiliados/sub-components/show-afiliado/show-afiliado.component';
import { ContactoTabOperacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-operaciones/contacto-tab-operaciones.component';
import { ContactoTabEvaluacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-evaluaciones/contacto-tab-evaluaciones.component';
import { ShowTalleristaComponent } from './components/contactos-talleristas/sub-components/show-tallerista/show-tallerista.component';
import { EditAseguradoComponent } from './components/contactos-afiliados/sub-components/edit-asegurado/edit-asegurado.component';
import { ContactoTabContratosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-contratos/contacto-tab-contratos.component';
import { ContactoTabCalendarioComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-calendario/contacto-tab-calendario.component';
import { ContactoTabTalleresComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-talleres/contacto-tab-talleres.component';
import { ContactosBusquedaComponent } from './components/contactos-busqueda/contactos-busqueda.component';
import { ContactoTabNotasComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-notas/contacto-tab-notas.component';

const routes: Routes = [
  {
    path: '',
    component: ContactosComponent,
    children:[
      {
        path: '',
        component: ContactosAfiliadosComponent,
        title: 'Contacto - Afiliados'
      },
      {
        path: 'talleristas',
        children:[
          {
            path: '',
            component: ContactosTalleristasComponent,
            title: 'Contacto - Talleristas'
          },
          {
            path: 'show/:idTallerista',
            component: ShowTalleristaComponent,
            children: [
              {
                path: '',
                component: ContactoTabContratosComponent,
                title: 'Tallerista - Datos del contrato'
              },
              {
                path: 'calendarios',
                component: ContactoTabCalendarioComponent,
                title: 'Tallerista - Calendarios'
              },
              {
                path: 'talleres',
                component: ContactoTabTalleresComponent,
                title: 'Tallerista - Talleres'
              },
              {
                path: 'evaluaciones',
                component: ContactoTabEvaluacionesComponent,
                title: 'Tallerista - Evaluaciones'
              }
            ]
          },
        ]
      },
      {
        path: 'show/:idFicha',
        component: ShowAfiliadoComponent,
        children: [
          {
            path: '',
            component: ContactoTabOperacionesComponent,
            title: 'Datos Afiliado'
          },
          {
            path: 'evaluaciones',
            component: ContactoTabEvaluacionesComponent,
            title: 'Evaluaciones Afiliado'
          },
          {
            path: 'notas',
            component: ContactoTabNotasComponent,
            title: 'Notas Componente'
          }
        ]
      },
      {
        path: 'busqueda/:idFicha',
        component: ShowAfiliadoComponent,
        children: [
          {
            path: '',
            component: ContactoTabOperacionesComponent,
            title: 'Datos Afiliado'
          },
          {
            path: 'evaluaciones',
            component: ContactoTabEvaluacionesComponent,
            title: 'Evaluaciones Afiliado'
          },
          {
            path: 'notas',
            component: ContactoTabNotasComponent,
            title: 'Notas Componente'
          }
        ]
      },
      {
        path: 'busqueda',
        component: ContactosBusquedaComponent,
        title: 'Contacto - Afiliados'
      },
    ]
  },
  {
    path: 'edit-info-aseg/:idFicha',
    component: EditAseguradoComponent,
    title: 'Editar Información del asegurado'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule { }
