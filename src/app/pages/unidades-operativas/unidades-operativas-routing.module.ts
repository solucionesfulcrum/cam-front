import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadesOperativasMainComponent } from './unidades-operativas-main/unidades-operativas-main.component'; // Asegúrate de importar tu componente
import { ListComponent } from './list/list.component';
import { ListCiramComponent } from './list-ciram/list-ciram.component';

const routes: Routes = [
  {
    path: '',
    component: UnidadesOperativasMainComponent,
    children:[
      {
        path:'',
        component:ListComponent,
      },
      {
        path:'ciram',
        component:ListCiramComponent,
      },
    ]
  },
  // Puedes agregar más rutas aquí según sea necesario
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadesOperativasRoutingModule { }