import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactosAfiliadosComponent } from './components/contactos-afiliados/contactos-afiliados.component';
import { ContactosTalleristasComponent } from './components/contactos-talleristas/contactos-talleristas.component';

const routes: Routes = [
  {
    path: '',
    component: ContactosComponent,
    children:[
      {
        path: '',
        component: ContactosAfiliadosComponent
      },
      {
        path: 'talleristas',
        component: ContactosTalleristasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactosRoutingModule { }
