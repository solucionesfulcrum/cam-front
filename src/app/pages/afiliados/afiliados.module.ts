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
import { FichaAfilComponent } from './afiliados/ficha-afil/ficha-afil.component';
import { ModalActivarAfilComponent } from './show-afil/modalActivar/modal-activar-afil.component';
import { MatCardModule } from '@angular/material/card';
import { SubListActivacionesAfilComponent } from './show-afil/sub-list-activaciones-afil/sub-list-activaciones-afil.component';
import { ShowSolComponent } from './show-sol/show-sol.component';
import { ModalActivarSolComponent } from './show-sol/modal-activar-sol/modal-activar-sol.component';
import { SubListActivacionesSolComponent } from './show-sol/sub-list-activaciones-sol/sub-list-activaciones-sol.component';
import { EditSolComponent } from './edit-sol/edit-sol.component';
import { NewEvalAfiliadoComponent } from './components/new-eval-afiliado/new-eval-afiliado.component';
import { NotasAfilComponent } from './components/notas-afil/notas-afil.component';
import { NewEval2AfiliadoComponent } from './components/new-eval2-afiliado/new-eval2-afiliado.component';
import { NewEval3AfiliadoComponent } from './components/new-eval3-afiliado/new-eval3-afiliado.component';
import { NewEval4AfiliadoComponent } from './components/new-eval4-afiliado/new-eval4-afiliado.component';
import { ResultEvalAfiliadoComponent } from './components/result-eval-afiliado/result-eval-afiliado.component';
import { AfilOperComponent } from './components/afil-oper/afil-oper.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AfilEvalComponent } from './components/afil-eval/afil-eval.component';
import { CustomDatePipe } from '@shared/custom-date.pipe';
import { CdkTableModule } from '@angular/cdk/table';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EvaluacionLayoutComponent } from './components/evaluacion-layout/evaluacion-layout.component';



@NgModule({
  declarations: [
    AfiliadosLayoutComponent,
    AfiliadosComponent,
    AnalisisComponent,
    SolicitudesComponent,
    EvaluacionComponent,
    ShowAfilComponent,
    FichaAfilComponent,
    ModalActivarAfilComponent,
    SubListActivacionesAfilComponent,
    ShowSolComponent,
    ModalActivarSolComponent,
    SubListActivacionesSolComponent,
    EditSolComponent,
    NewEvalAfiliadoComponent,
    NotasAfilComponent,
    NewEval2AfiliadoComponent,
    NewEval3AfiliadoComponent,
    NewEval4AfiliadoComponent,
    ResultEvalAfiliadoComponent,
    AfilOperComponent,
    TabsComponent,
    AfilEvalComponent,
    CustomDatePipe,
    EvaluacionLayoutComponent,
  
  ],
  imports: [
    AfiliadosRoutingModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    CdkTableModule,
    MatCheckboxModule,
    MenuOpcionesComponent,
    MatTooltipModule,
    MatCardModule,
    RouterModule,
    DialogModule,
    SharedModule,
  ]
})
export class AfiliadosModule { }
