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
import { FichaAfilComponent } from './afiliados/ficha-afil/ficha-afil.component';
import { MatCardModule } from '@angular/material/card';
import { ShowSolComponent } from './show-sol/show-sol.component';
import { ModalActivarSolComponent } from './show-sol/modal-activar-sol/modal-activar-sol.component';
import { SubListActivacionesSolComponent } from './show-sol/sub-list-activaciones-sol/sub-list-activaciones-sol.component';
import { EditSolComponent } from './edit-sol/edit-sol.component';
import { AfilOperComponent } from './components/afil-oper/afil-oper.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { AfilEvalComponent } from './components/afil-eval/afil-eval.component';
import { CustomDatePipe } from '@shared/custom-date.pipe';
import { CdkTableModule } from '@angular/cdk/table';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { EvaluacionLayoutComponent } from './components/evaluacion-layout/evaluacion-layout.component';
import { EvaluacionAPfeifferComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-a-pfeiffer/evaluacion-a-pfeiffer.component';
import { EvaluacionBKatzComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-b-katz/evaluacion-b-katz.component';
import { EvaluacionCGijonComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-c-gijon/evaluacion-c-gijon.component';
import { EvaluacionDYesavageComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-d-yesavage/evaluacion-d-yesavage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ContenedorEvaluacionComponent } from './components/evaluacion-layout/evaluaciones/contenedor-evaluacion/contenedor-evaluacion.component';
import { EvaluacionResultadosComponent } from './components/evaluacion-layout/evaluaciones/evaluacion-resultados/evaluacion-resultados.component';
import { DialogNotasComponent } from './show-sol/dialog-notas/dialog-notas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    AfiliadosLayoutComponent,
    AfiliadosComponent,
    AnalisisComponent,
    SolicitudesComponent,
    EvaluacionComponent,
    FichaAfilComponent,
    ShowSolComponent,
    ModalActivarSolComponent,
    SubListActivacionesSolComponent,
    EditSolComponent,
    AfilOperComponent,
    TabsComponent,
    AfilEvalComponent,
    CustomDatePipe,
    EvaluacionLayoutComponent,
    EvaluacionAPfeifferComponent,
    EvaluacionBKatzComponent,
    EvaluacionCGijonComponent,
    EvaluacionDYesavageComponent,
    ContenedorEvaluacionComponent,
    EvaluacionResultadosComponent,
    DialogNotasComponent,
  
  ],
  imports: [
    AfiliadosRoutingModule,
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    CdkTableModule,
    MatCheckboxModule,
    MenuOpcionesComponent,
    MatTooltipModule,
    MatCardModule,
    RouterModule,
    MaterialModule,
    DialogModule,
    SharedModule,
  ]
})
export class AfiliadosModule { }
