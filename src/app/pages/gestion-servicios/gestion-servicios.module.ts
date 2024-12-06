import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionServiciosRoutingModule } from './gestion-servicios-routing.module';
import { GestionServiciosComponent } from './gestion-servicios/gestion-servicios.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ListaServiciosComponent } from './componentes/lista-servicios/lista-servicios.component';
import { ListaSubprogramasComponent } from './componentes/lista-subprogramas/lista-subprogramas.component';
import { ListaProgramasComponent } from './componentes/lista-programas/lista-programas.component';
import { EditarServicioComponent } from './componentes/dialogs/editar-servicio/editar-servicio.component';
import { EditarSubProgramaComponent } from './componentes/dialogs/editar-sub-programa/editar-sub-programa.component';
import { EditarProgramaComponent } from './componentes/dialogs/editar-programa/editar-programa.component';
import { CrearServicioComponent } from './componentes/dialogs/crear-servicio/crear-servicio.component';
import { CrearSubProgramaComponent } from './componentes/dialogs/crear-sub-programa/crear-sub-programa.component';
import { CrearProgramaComponent } from './componentes/dialogs/crear-programa/crear-programa.component';


@NgModule({
  declarations: [
    GestionServiciosComponent,
    ListaServiciosComponent,
    ListaSubprogramasComponent,
    ListaProgramasComponent,
    EditarServicioComponent,
    EditarSubProgramaComponent,
    EditarProgramaComponent,
    CrearServicioComponent,
    CrearSubProgramaComponent,
    CrearProgramaComponent
  ],
  imports: [
    CommonModule,
    GestionServiciosRoutingModule,
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
export class GestionServiciosModule { }
