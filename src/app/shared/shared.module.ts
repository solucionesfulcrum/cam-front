import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FiltroFechaComponent } from './components/filtro-fecha/filtro-fecha.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MenuOpcionesComponent } from './components/menu-opciones/menu-opciones.component';
import { OpcionesBusquedaComponent } from './components/opciones-busqueda/opciones-busqueda.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BtnComponent } from './components/btn/btn.component';
import { IconComponent } from './components/icon/icon.component';
import { OpcionRegresarComponent } from './components/opcion-regresar/opcion-regresar.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { Pregunt1opcComponent } from './components/pregunt1opc/pregunt1opc.component';
import { OpcionesBotonesComponent } from './components/opciones-botones/opciones-botones.component';


const modules:any[] = [
  CommonModule,
  RouterModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  MatTabsModule,
  NgxDaterangepickerMd.forRoot(),
  //COMPONENTS
   BtnComponent,
   IconComponent,
   FiltroFechaComponent,
   MenuOpcionesComponent,
   OpcionesBusquedaComponent,
   OpcionRegresarComponent,
   PreguntasComponent,
   Pregunt1opcComponent,
   OpcionesBotonesComponent

]

@NgModule({
  
  imports: [
    ...modules
  ],exports:[...modules], declarations: [
  ]
})
export class SharedModule { }
