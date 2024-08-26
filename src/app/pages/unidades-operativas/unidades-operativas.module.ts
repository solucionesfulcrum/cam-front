import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadesOperativasMainComponent } from './unidades-operativas-main/unidades-operativas-main.component';
import { UnidadesOperativasRoutingModule } from './unidades-operativas-routing.module';
import { ListComponent } from './list/list.component';
import { MenuOpcionesComponent } from "../../shared/components/menu-opciones/menu-opciones.component";
import { DialogModule } from '@angular/cdk/dialog';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { UsersRoutingModule } from '../users/users-routing.module';
import { ListCiramComponent } from './list-ciram/list-ciram.component';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';

/*
  imports: [
    CommonModule,
    SharedModule,
    CdkTableModule,
    CdkMenuModule,
    DialogModule,
    MatTabsModule,
    MatPaginatorModule,
    UsersRoutingModule,
    MaterialModule,
    MatAutocompleteModule,
  ],
*/

@NgModule({
    declarations: [
        UnidadesOperativasMainComponent,
        ListComponent,
        ListCiramComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      CdkTableModule,
      CdkMenuModule,
      DialogModule,
      MatTabsModule,
      MatPaginatorModule,
      UnidadesOperativasRoutingModule,
      MaterialModule,
      MatAutocompleteModule,
      UnidadesOperativasRoutingModule,
      MenuOpcionesComponent,
      DataLoadingComponent
    ]
})
export class UnidadesOperativasModule { }
