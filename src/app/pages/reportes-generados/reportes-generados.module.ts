import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesGeneradosRoutingModule } from './reportes-generados-routing.module';
import { ReportesGeneradosComponent } from './reportes-generados/reportes-generados.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReportesExcelComponent } from './componentes/reportes-excel/reportes-excel.component';
import { DetalleReporteComponent } from './componentes/dialogs/detalle-reporte/detalle-reporte.component';


@NgModule({
  declarations: [
    ReportesGeneradosComponent,
    ReportesExcelComponent,
    DetalleReporteComponent
  ],
  imports: [
    CommonModule,
    ReportesGeneradosRoutingModule,
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
export class ReportesGeneradosModule { }
