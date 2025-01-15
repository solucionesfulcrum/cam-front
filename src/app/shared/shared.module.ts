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
import { ModalSinInternetComponent } from './components/modal-sin-internet/modal-sin-internet.component';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizarPipe } from '../pipes/capitalizar.pipe';
import { MaterialModule } from '../material/material.module';
import { ModalAlertComponent } from './components/modal-alert/modal-alert.component';
import { ModalConfirmarGenericoComponent } from './components/modal-confirmar-generico/modal-confirmar-generico.component';
import { EstiloInputDirective } from '../directivas/estilo-input.directive';
import { EstiloLabelDirective } from '../directivas/estilo-label.directive';
import { DataLoadingComponent } from './components/data-loading/data-loading.component';


const modules:any[] = [
  CommonModule,
  RouterModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  MatTabsModule,
  NgxDaterangepickerMd.forRoot(),
  MaterialModule,
  //COMPONENTS
   ButtonComponent,
   IconComponent,
   FiltroFechaComponent,
   MenuOpcionesComponent,
   OpcionesBusquedaComponent,
   DataLoadingComponent,
   OpcionesBotonesComponent,
   CartillaInfoComponent,
   TablaAdaptableComponent,
   PreguntasComponent,
   Pregunt1opcComponent,
   MatIconModule,
   CapitalizarPipe,
   EstiloInputDirective,
   EstiloLabelDirective
]

@NgModule({
  imports: [
    ...modules 
  ],exports:[...modules], declarations: [ModalSinInternetComponent, ModalAlertComponent, ModalConfirmarGenericoComponent]
})
export class SharedModule { }
