import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AtencionRoutingModule } from './atencion-routing.module';
import { AtencionComponent } from './atencion/atencion.component';
import { AtencionAperturaComponent } from './components/atencion-apertura/atencion-apertura.component';
import { AtencionPendienteComponent } from './components/atencion-pendiente/atencion-pendiente.component';
import { AtencionAtendidoComponent } from './components/atencion-atendido/atencion-atendido.component';
import { AtencionNoAtendidoComponent } from './components/atencion-no-atendido/atencion-no-atendido.component';
import { AtencionHistorialComponent } from './components/atencion-historial/atencion-historial.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogConfirmAtencionMedicaComponent } from './components/atencion-pendiente/dialog-confirm-atencion-medica/dialog-confirm-atencion-medica.component';
import { EvaluacionContenedorComponent } from './components/evaluacion-contenedor/evaluacion-contenedor.component';
import { EvaRPRSDatosPersonalesComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-datos-personales/eva-rprs-datos-personales.component';
import { EvaRPRSAntecedentesPatologicosComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-antecedentes-patologicos/eva-rprs-antecedentes-patologicos.component';
import { EvaRPRSAntecedentesFamiliaresComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-antecedentes-familiares/eva-rprs-antecedentes-familiares.component';
import { EvaluacionRPRSComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/evaluacion-rp-rs.component';
import { EvaRPRSControlEsfinteresComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-control-esfinteres/eva-rprs-control-esfinteres.component';
import { EvaRPRSHabitosNocivosComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-habitos-nocivos/eva-rprs-habitos-nocivos.component';
import { EvaRPRSDanioPrincipalComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-danio-principal/eva-rprs-danio-principal.component';
import { EvaRPRSCausaDeficienciaComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-causa-deficiencia/eva-rprs-causa-deficiencia.component';
import { EvaRPRSDiscapacidadComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-discapacidad/eva-rprs-discapacidad.component';
import { EvaRPRSPlanRehabilitacionComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-plan-rehabilitacion/eva-rprs-plan-rehabilitacion.component';


@NgModule({
  declarations: [
    AtencionComponent,
    AtencionAperturaComponent,
    AtencionPendienteComponent,
    AtencionAtendidoComponent,
    AtencionNoAtendidoComponent,
    AtencionHistorialComponent,
    DialogConfirmAtencionMedicaComponent,
    EvaluacionContenedorComponent,
    EvaRPRSDatosPersonalesComponent,
    EvaRPRSAntecedentesPatologicosComponent,
    EvaRPRSAntecedentesFamiliaresComponent,
    EvaluacionRPRSComponent,
    EvaRPRSControlEsfinteresComponent,
    EvaRPRSHabitosNocivosComponent,
    EvaRPRSDanioPrincipalComponent,
    EvaRPRSCausaDeficienciaComponent,
    EvaRPRSDiscapacidadComponent,
    EvaRPRSPlanRehabilitacionComponent
  ],
  imports: [
    CommonModule,
    AtencionRoutingModule,
    SharedModule,
    MaterialModule,
    CdkTableModule
  ],
  providers: [
    DatePipe
  ]
})
export class AtencionModule { }
