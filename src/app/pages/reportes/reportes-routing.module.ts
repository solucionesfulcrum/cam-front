import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesLayoutComponent } from './reportes-layout.component';

const routes: Routes = [
  { path: '', component:  ReportesLayoutComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
