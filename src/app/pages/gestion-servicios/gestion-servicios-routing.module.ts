import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionServiciosComponent } from './gestion-servicios/gestion-servicios.component';
import { ListaServiciosComponent } from './componentes/lista-servicios/lista-servicios.component';
import { ListaSubprogramasComponent } from './componentes/lista-subprogramas/lista-subprogramas.component';
import { ListaProgramasComponent } from './componentes/lista-programas/lista-programas.component';

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
      },
      {
        path: "lista-sub-programas",
        component: ListaSubprogramasComponent
      }
      , {
        path: "lista-programas",
        component: ListaProgramasComponent
      }
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionServiciosRoutingModule { }
