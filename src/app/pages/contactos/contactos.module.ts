import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactosRoutingModule } from './contactos-routing.module';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactosAfiliadosComponent } from './components/contactos-afiliados/contactos-afiliados.component';
import { ContactosTalleristasComponent } from './components/contactos-talleristas/contactos-talleristas.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
  declarations: [
    ContactosComponent,
    ContactosAfiliadosComponent,
    ContactosTalleristasComponent
  ],
  imports: [
    CommonModule,
    ContactosRoutingModule,
    CdkTableModule,
    MaterialModule,
    SharedModule
  ]
})
export class ContactosModule { }
