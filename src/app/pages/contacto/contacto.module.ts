import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoRoutingModule } from './contacto-routing.module';
import { ContactoComponent } from './contacto/contacto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogModule } from '@angular/cdk/dialog';
import { SharedModule } from '@shared/shared.module';
import { ContactoProfesionalesComponent } from './components/contacto-profesionales/contacto-profesionales.component';
import { ContactoRpsUsersComponent } from './components/contacto-rps-users/contacto-rps-users.component';
import { ContactoAliadosComponent } from './components/contacto-aliados/contacto-aliados.component';
import { ContactoSubDetalleProfesionalComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/contacto-sub-detalle-profesional.component';
import { TabContactoDetalleParametrosComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/tabs/tab-contacto-detalle-parametros/tab-contacto-detalle-parametros.component';
import { TabContactoDetalleHorariosComponent } from './components/contacto-profesionales/sub-components/contacto-sub-detalle-profesional/tabs/tab-contacto-detalle-horarios/tab-contacto-detalle-horarios.component';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
  declarations: [
    ContactoComponent,
    ContactoProfesionalesComponent,
    ContactoRpsUsersComponent,
    ContactoAliadosComponent,
    ContactoSubDetalleProfesionalComponent,
    TabContactoDetalleParametrosComponent,
    TabContactoDetalleHorariosComponent
  ],
  imports: [
    CommonModule,
    ContactoRoutingModule,
    CdkTableModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MaterialModule,
    ReactiveFormsModule,
    DialogModule,
  ]
})
export class ContactoModule { }
