import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '@shared/components/btn/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { FiltroFechaComponent } from './components/filtro-fecha/filtro-fecha.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MenuOpcionesComponent } from './components/menu-opciones/menu-opciones.component';
import { OpcionesBusquedaComponent } from './components/opciones-busqueda/opciones-busqueda.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OpcionesBotonesComponent } from './components/opciones-botones/opciones-botones.component';
import { CartillaInfoComponent } from './components/cartilla-info/cartilla-info.component';
import { TablaAdaptableComponent } from './components/tabla-adaptable/tabla-adaptable.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { Pregunt1opcComponent } from './components/pregunt1opc/pregunt1opc.component';
import { SelectPersonalizadoComponent } from './components/select-personalizado/select-personalizado.component';
import { ModalSinInternetComponent } from './components/modal-sin-internet/modal-sin-internet.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';


const modules:any[] = [
  CommonModule,
  RouterModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  MatTabsModule,
  NgxDaterangepickerMd.forRoot(),
  //COMPONENTS
   ButtonComponent,
   IconComponent,
   FiltroFechaComponent,
   MenuOpcionesComponent,
   OpcionesBusquedaComponent,
   OpcionesBotonesComponent,
   CartillaInfoComponent,
   TablaAdaptableComponent,
   PreguntasComponent,
   Pregunt1opcComponent,
   MatIconModule
]

@NgModule({
  imports: [
    ...modules
  ],exports:[...modules], declarations: [ModalSinInternetComponent]
})
export class SharedModule { }
