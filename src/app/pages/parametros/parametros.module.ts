import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros-routing.module';
import { ParametrosComponent } from './parametros/parametros.component';
import { ListaParametrosComponent } from './components/lista-parametros/lista-parametros.component';
import { RegistrarParametroComponent } from './components/dialogs/registrar-parametro/registrar-parametro.component';
import { EditarParametroComponent } from './components/dialogs/editar-parametro/editar-parametro.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    ParametrosComponent,
    ListaParametrosComponent,
    RegistrarParametroComponent,
    EditarParametroComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    CdkTableModule,
    FormsModule,
    SharedModule,
    MatAutocompleteModule,
    MaterialModule,
    ReactiveFormsModule,
    DialogModule,
    DataLoadingComponent
  ]
})
export class ParametrosModule { }
