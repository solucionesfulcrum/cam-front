import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdmissionRoutingModule } from './admission-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AdmissionComponent } from './admission/admission.component';
import { SharedModule } from '@shared/shared.module';
import { CdkMenuModule} from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NewFichaAdmisionComponent } from './components/ficha-admision/dialogs/new-ficha-admision/new-ficha-admision.component';
import { DialogModule } from '@angular/cdk/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogNewDireccionComponent } from './components/ficha-admision/sub-components/postulacion-ficha-admision/dialogs/dialog-new-direccion/dialog-new-direccion.component';
import { DialogDataAcompanianteComponent } from './components/ficha-admision/sub-components/postulacion-ficha-admision/dialogs/dialog-data-acompaniante/dialog-data-acompaniante.component';
import { DialogModalidadIngresoComponent } from './components/ficha-admision/sub-components/postulacion-ficha-admision/dialogs/dialog-modalidad-ingreso/dialog-modalidad-ingreso.component';
import { FichaAdmisionComponent } from './components/ficha-admision/ficha-admision.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { CitasComponent } from './components/citas/citas.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ShowFichaAdmisionComponent } from './components/ficha-admision/sub-components/show-ficha-admision/show-ficha-admision.component';
import { EditFichaAdmisionComponent } from './components/ficha-admision/sub-components/edit-ficha-admision/edit-ficha-admision.component';
import { PostulacionFichaAdmisionComponent } from './components/ficha-admision/sub-components/postulacion-ficha-admision/postulacion-ficha-admision.component';
import { MaterialModule } from 'src/app/material/material.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CitaDetalleComponent } from './components/citas/sub-components/cita-detalle/cita-detalle.component';
import { CitaProgramacionComponent } from './components/citas/sub-components/cita-programacion/cita-programacion.component';
import { DialogRecordatorioComponent } from './components/citas/sub-components/cita-programacion/dialog-recordatorio/dialog-recordatorio.component';
import { TabCitaActividadesComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-actividades/tab-cita-actividades.component';
import { TabCitaHistorialComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-historial/tab-cita-historial.component';
import { DialogConfirmacionRegistroComponent } from './components/citas/sub-components/cita-programacion/dialog-confirmacion-registro/dialog-confirmacion-registro.component';
import { HistorialVisualizacionComponent } from './components/citas/sub-components/cita-detalle/components/tab-cita-historial/historial-visualizacion/historial-visualizacion.component';

@NgModule({
  declarations: [
    AdmissionComponent,
    NewFichaAdmisionComponent,
    PostulacionFichaAdmisionComponent,
    DialogNewDireccionComponent,
    DialogDataAcompanianteComponent,
    DialogModalidadIngresoComponent,
    FichaAdmisionComponent,
    TurnosComponent,
    CitasComponent,
    ShowFichaAdmisionComponent,
    EditFichaAdmisionComponent,
    CitaDetalleComponent,
    CitaProgramacionComponent,
    DialogRecordatorioComponent,
    TabCitaActividadesComponent,
    TabCitaHistorialComponent,
    DialogConfirmacionRegistroComponent,
    HistorialVisualizacionComponent
  ],
  imports: [
    CommonModule,
    AdmissionRoutingModule,
    FormsModule,
    CdkMenuModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatListModule,
    MaterialModule,
    ToastrModule.forRoot(),
    SharedModule,
    MatButtonModule,
    CdkTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    DialogModule,
    NgxDaterangepickerMd
  ],
  providers: [
    {provide: ToastrService, useClass: ToastrService},
    DatePipe
  ]
})
export class AdmissionModule { }
