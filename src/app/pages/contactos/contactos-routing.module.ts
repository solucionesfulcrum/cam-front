import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactosAfiliadosComponent } from './components/contactos-afiliados/contactos-afiliados.component';
import { ContactosTalleristasComponent } from './components/contactos-talleristas/contactos-talleristas.component';
import { ShowAfiliadoComponent } from './components/contactos-afiliados/sub-components/show-afiliado/show-afiliado.component';
import { ContactoTabOperacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-operaciones/contacto-tab-operaciones.component';
import { ContactoTabEvaluacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-evaluaciones/contacto-tab-evaluaciones.component';
import { ShowTalleristaComponent } from './components/contactos-talleristas/sub-components/show-tallerista/show-tallerista.component';
import { ContactoTabParametrosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-parametros/contacto-tab-parametros.component';
import { ContactoTabHorariosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-horarios/contacto-tab-horarios.component';
import { RegisterAseguradoComponent } from './components/contactos-afiliados/sub-components/register-asegurado/register-asegurado.component';

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
            path: 'show/:tipoDoc/:numDoc',
            component: ShowTalleristaComponent,
            children: [
              {
                path: '',
                component: ContactoTabParametrosComponent,
                title: 'Datos del Tallerista'
              },
              {
                path: 'horarios',
                component: ContactoTabHorariosComponent,
                title: 'Horarios tallerista'
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
          }
        ]
      }
    ]
  },
  {
    path: 'register/:tipoDoc/:numDoc',
    component: RegisterAseguradoComponent,
    title: 'Registrar Asegurado'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule { }
