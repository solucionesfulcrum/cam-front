import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminContactosRoutingModule } from './admin-contactos-routing.module';
import { AdminContactosComponent } from './admin-contactos/admin-contactos.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AseguradosComponent } from './components/asegurados/asegurados.component';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';


@NgModule({
  declarations: [
    AdminContactosComponent,
    AseguradosComponent
  ],
  imports: [
    CommonModule,
    AdminContactosRoutingModule,
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
export class AdminContactosModule { }
