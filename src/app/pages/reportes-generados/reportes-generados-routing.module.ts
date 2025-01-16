import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesGeneradosComponent } from './reportes-generados/reportes-generados.component';
import { ReportesExcelComponent } from './componentes/reportes-excel/reportes-excel.component';

const routes: Routes = [
  {
    component: ReportesGeneradosComponent,
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reportes-excel'
      },
      {
        path: 'reportes-excel',
        component: ReportesExcelComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesGeneradosRoutingModule { }
