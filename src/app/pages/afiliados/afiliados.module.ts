import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AfiliadosRoutingModule } from './afiliados-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AfiliadosLayoutComponent } from './afiliados-layout.component';

import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AfiliadosComponent } from './afiliados/afiliados.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { MenuOpcionesComponent } from '@shared/components/menu-opciones/menu-opciones.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShowAfilComponent } from './show-afil/show-afil.component';

@NgModule({
  declarations: [
    AfiliadosLayoutComponent,
    AfiliadosComponent,
    AnalisisComponent,
    SolicitudesComponent,
    EvaluacionComponent,
    ShowAfilComponent,
  ],
  imports: [
    AfiliadosRoutingModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MenuOpcionesComponent,
    MatTooltipModule,
    RouterModule,
    SharedModule,
   
  ]
})
export class AfiliadosModule { }
