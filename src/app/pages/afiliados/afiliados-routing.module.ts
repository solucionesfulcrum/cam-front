import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfiliadosLayoutComponent } from './afiliados-layout.component';

const routes: Routes = [
  { path: '', component: AfiliadosLayoutComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfiliadosRoutingModule {}
