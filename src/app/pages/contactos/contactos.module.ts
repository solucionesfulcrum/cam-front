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
import { DialogNewAseguradoComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-new-asegurado/dialog-new-asegurado.component';
import { RegisterAseguradoComponent } from './components/contactos-afiliados/sub-components/register-asegurado/register-asegurado.component';
import { DialogNewDireccionComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-new-direccion/dialog-new-direccion.component';
import { DialogModalidadIngresoComponent } from './components/contactos-afiliados/sub-components/dialog/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditAseguradoComponent } from './components/contactos-afiliados/sub-components/edit-asegurado/edit-asegurado.component';
import { ContactoTabContratosComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-contratos/contacto-tab-contratos.component';
import { ContactoTabCalendarioComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-calendario/contacto-tab-calendario.component';
import { ContactoTabTalleresComponent } from './components/contactos-talleristas/sub-components/show-tallerista/tabs/contacto-tab-talleres/contacto-tab-talleres.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { DivProporcionalDirective } from 'src/app/directivas/tabla-proporcional.directive';
import { ContactosBusquedaComponent } from './components/contactos-busqueda/contactos-busqueda.component';
import { ContactoTabNotasComponent } from './components/contactos-afiliados/sub-components/show-afiliado/tabs/contacto-tab-notas/contacto-tab-notas.component';
import { AgregarACiramComponent } from './components/contactos-afiliados/sub-components/dialog/agregar-a-ciram/agregar-a-ciram.component';


@NgModule({
  declarations: [
    ContactosComponent,
    ContactosAfiliadosComponent,
    ContactosTalleristasComponent,
    ShowAfiliadoComponent,
    ContactoTabOperacionesComponent,
    ContactoTabEvaluacionesComponent,
    ShowTalleristaComponent,
    DialogNewAseguradoComponent,
    RegisterAseguradoComponent,
    DialogNewDireccionComponent,
    DialogModalidadIngresoComponent,
    EditAseguradoComponent,
    ContactoTabContratosComponent,
    ContactoTabCalendarioComponent,
    ContactoTabTalleresComponent,
    DivProporcionalDirective,
    ContactosBusquedaComponent,
    ContactoTabNotasComponent,
    AgregarACiramComponent,
  ],
  imports: [
    CommonModule,
    ContactosRoutingModule,
    CdkTableModule,
    MatAutocompleteModule,
    MaterialModule,
    SharedModule,
    CdkMenuModule,
    DataLoadingComponent
  ]
})
export class ContactosModule { }
