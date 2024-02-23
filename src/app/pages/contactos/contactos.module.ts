import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactosRoutingModule } from './contactos-routing.module';
import { ContactosComponent } from './contactos/contactos.component';
import { ContactosAfiliadosComponent } from './components/contactos-afiliados/contactos-afiliados.component';
import { ContactosTalleristasComponent } from './components/contactos-talleristas/contactos-talleristas.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CdkTableModule } from '@angular/cdk/table';
import { ShowAfiliadoComponent } from './components/contactos-afiliados/sub-components/show-afiliado/show-afiliado.component';
import { ContactoTabOperacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-operaciones/contacto-tab-operaciones.component';
import { ContactoTabEvaluacionesComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-evaluaciones/contacto-tab-evaluaciones.component';
import { ShowTalleristaComponent } from './components/contactos-talleristas/sub-components/show-tallerista/show-tallerista.component';
import { ContactoTabParametrosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-parametros/contacto-tab-parametros.component';
import { ContactoTabHorariosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-horarios/contacto-tab-horarios.component';
import { DialogNewAseguradoComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';
import { RegisterAseguradoComponent } from './components/contactos-afiliados/sub-components/register-asegurado/register-asegurado.component';
import { DialogNewDireccionComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-new-direccion/dialog-new-direccion.component';
import { DialogModalidadIngresoComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    ContactosComponent,
    ContactosAfiliadosComponent,
    ContactosTalleristasComponent,
    ShowAfiliadoComponent,
    ContactoTabOperacionesComponent,
    ContactoTabEvaluacionesComponent,
    ShowTalleristaComponent,
    ContactoTabParametrosComponent,
    ContactoTabHorariosComponent,
    DialogNewAseguradoComponent,
    RegisterAseguradoComponent,
    DialogNewDireccionComponent,
    DialogModalidadIngresoComponent
  ],
  imports: [
    CommonModule,
    ContactosRoutingModule,
    CdkTableModule,
    MatAutocompleteModule,
    MaterialModule,
    SharedModule
  ]
})
export class ContactosModule { }
