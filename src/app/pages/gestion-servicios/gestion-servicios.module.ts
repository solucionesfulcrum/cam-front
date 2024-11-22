import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionServiciosRoutingModule } from './gestion-servicios-routing.module';
import { GestionServiciosComponent } from './gestion-servicios/gestion-servicios.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ListaServiciosComponent } from './componentes/lista-servicios/lista-servicios.component';


@NgModule({
  declarations: [
    GestionServiciosComponent,
    ListaServiciosComponent
  ],
  imports: [
    CommonModule,
    GestionServiciosRoutingModule,
    CdkTableModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MaterialModule,
    ReactiveFormsModule,
    DialogModule,
    DataLoadingComponent,
  ]
})
export class GestionServiciosModule { }
