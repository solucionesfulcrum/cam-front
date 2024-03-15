import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtencionComponent } from './atencion/atencion.component';
import { AtencionAperturaComponent } from './components/atencion-apertura/atencion-apertura.component';
import { AtencionPendienteComponent } from './components/atencion-pendiente/atencion-pendiente.component';
import { AtencionAtendidoComponent } from './components/atencion-atendido/atencion-atendido.component';
import { AtencionNoAtendidoComponent } from './components/atencion-no-atendido/atencion-no-atendido.component';
import { AtencionHistorialComponent } from './components/atencion-historial/atencion-historial.component';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { EvaluacionContenedorComponent } from './components/evaluacion-contenedor/evaluacion-contenedor.component';
import { EvaluacionRPRSComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/evaluacion-rp-rs.component';
import { EvaRPRSDatosPersonalesComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-datos-personales/eva-rprs-datos-personales.component';
import { EvaRPRSAntecedentesPatologicosComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-antecedentes-patologicos/eva-rprs-antecedentes-patologicos.component';
import { EvaRPRSAntecedentesFamiliaresComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-antecedentes-familiares/eva-rprs-antecedentes-familiares.component';
import { EvaRPRSControlEsfinteresComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-control-esfinteres/eva-rprs-control-esfinteres.component';
import { EvaRPRSHabitosNocivosComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-habitos-nocivos/eva-rprs-habitos-nocivos.component';
import { EvaRPRSDanioPrincipalComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-danio-principal/eva-rprs-danio-principal.component';
import { EvaRPRSCausaDeficienciaComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-causa-deficiencia/eva-rprs-causa-deficiencia.component';
import { EvaRPRSDiscapacidadComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-discapacidad/eva-rprs-discapacidad.component';
import { EvaRPRSPlanRehabilitacionComponent } from './components/evaluacion-contenedor/evaluacion-RP-RS/eva-rprs-plan-rehabilitacion/eva-rprs-plan-rehabilitacion.component';

const routes: Routes = [
  {
    path: '',
    component: AtencionComponent,
    children: [
      {
        path: '',
        component: AtencionAperturaComponent,
        title: 'Aperturar atención de citas'
      },
      {
        path: AppRoute.ATENCIONES_PENDIENTES,
        component: AtencionPendienteComponent,
        title: 'Ver atenciones pendientes'
      },
      {
        path: AppRoute.ATENCIONES_ATENDIDOS,
        component: AtencionAtendidoComponent,
        title: 'Ver citas atendidas'
      },
      {
        path: AppRoute.ATENCIONES_NO_ATENDIDOS,
        component: AtencionNoAtendidoComponent,
        title: 'Ver citas no atendidas'
      },
      {
        path: AppRoute.ATENCIONES_HISTORIAL,
        component: AtencionHistorialComponent,
        title: 'Ver historial de atenciones'
      },
    ]
  },
  {
    path: 'evaluacion/:idAtencion',
    component: EvaluacionContenedorComponent,
    title: 'Realizar Evaluación RP y RS',
    children: [
      {
        path: 'RP-RS',
        component: EvaluacionRPRSComponent,
        children: [
          {
            path: '',
            component: EvaRPRSDatosPersonalesComponent,
            title: 'Evaluación RP y RS - Datos Personales',
          },
          {
            path: 'antecedentes-patologicos',
            component: EvaRPRSAntecedentesPatologicosComponent,
            title: 'Evaluación RP y RS - Antecedentes Patológicos',
          },
          {
            path: 'antecedentes-familiares',
            component: EvaRPRSAntecedentesFamiliaresComponent,
            title: 'Evaluación RP y RS - Antecedentes Familiares',
          },
          {
            path: 'control-esfinteres',
            component: EvaRPRSControlEsfinteresComponent,
            title: 'Evaluación RP y RS - Control de Esfínteres',
          },
          {
            path: 'habitos-nocivos',
            component: EvaRPRSHabitosNocivosComponent,
            title: 'Evaluación RP y RS - Hábitos Nocivos',
          },
          {
            path: 'danio-principal',
            component: EvaRPRSDanioPrincipalComponent,
            title: 'Evaluación RP y RS - Daño Principal y Etiológico',
          },
          {
            path: 'causa-deficiencia',
            component: EvaRPRSCausaDeficienciaComponent,
            title: 'Evaluación RP y RS - Causas de la Deficiencia / Discapacidad',
          },
          {
            path: 'discapacidad',
            component: EvaRPRSDiscapacidadComponent,
            title: 'Evaluación RP y RS - Discapacidad',
          },
          {
            path: 'plan-rehabilitacion',
            component: EvaRPRSPlanRehabilitacionComponent,
            title: 'Evaluación RP y RS - Plan de Rehabilitación',
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtencionRoutingModule { }
