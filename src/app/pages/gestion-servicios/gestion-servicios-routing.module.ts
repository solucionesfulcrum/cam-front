import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionServiciosComponent } from './gestion-servicios/gestion-servicios.component';
import { ListaServiciosComponent } from './componentes/lista-servicios/lista-servicios.component';

const routes: Routes = [
  {
    path: "",
    component: GestionServiciosComponent,
    children: [
      {
        path: "",
        redirectTo: "lista-servicios",
        pathMatch: "full"
      },
      {
        path: "lista-servicios",
        component: ListaServiciosComponent
      }
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionServiciosRoutingModule { }
