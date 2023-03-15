import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalleresLayoutComponent } from './talleres-layout.component';

const routes: Routes = [
  { path: '', component: TalleresLayoutComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalleresRoutingModule {}
