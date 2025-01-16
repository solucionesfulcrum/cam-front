export class AppRoute {
  static readonly APP = 'app';
  static readonly ADMIN = 'admin';
  static readonly USUARIOS = 'users';
  static readonly UNIDADES_OP = 'unidades-operativas';
  static readonly CONTACTOS = 'contactos';
  static readonly ASISTENCIA_RAPIDA = 'asistencia-rapida';
  static readonly REPORTES_GENERADOS = 'reportes-generados';
  static readonly GESTION_SERVICIOS = 'gestion-servicios';
  static readonly PARAMETROS = 'parametros';
  static readonly EDIT_USER = 'edit-user';
  //---------------------------------------------------------------------------------------------------------- RUTAS DASHBOARD
  static readonly DASHBOARD = 'dashboard';
  static readonly DASHBOARD_ASISTENCIAS_RAPIDAS = 'dash-asistencias-rapidas';
  static readonly DASHBOARD_ASISTENCIAS_PROGRAMADAS = 'dash-asistencias-programadas';
  //---------------------------------------------------------------------------------------------------------- RUTAS CONTRATOS
  static readonly CONTRATOS = 'contratos';
  static readonly CONTRATOS_ASIGNAR_SERVICIOS = 'asignar-servicios';
  static readonly CONTRATOS_CONFIRMAR_SERVICIOS = 'confirm-servicios';
  //---------------------------------------------------------------------------------------------------------- RUTAS PROGRAMACIÓN
  static readonly PROGRAMACION = 'programacion';
  static readonly PROGRAMACION_TAB_TALLERES = `${this.PROGRAMACION}/talleres`;
  static readonly PROGRAMACION_TAB_CALENDARIOS = `${this.PROGRAMACION}/calendarios`;

  //---------------------------------------------------------------------------------------------------------- RUTAS HORARIOS
  static readonly HORARIOS = 'schedule';
  static readonly CREAR_HORARIO = `create-${this.HORARIOS}`;
  static readonly EDIT_HORARIO = `edit-${this.HORARIOS}`;
  static readonly HORARIOS_BUSCAR = 'search';
  static readonly HORARIOS_CONFIGURAR = 'config';

  //---------------------------------------------------------------------------------------------------------- RUTAS ATENCIONES
  static readonly ATENCIONES = 'attention';
  // static readonly ATENCIONES_APERTURA = 'apertura';
  static readonly ATENCIONES_PENDIENTES = 'pending';
  static readonly ATENCIONES_ATENDIDOS = 'attended';
  static readonly ATENCIONES_NO_ATENDIDOS = 'not-attended';
  static readonly ATENCIONES_HISTORIAL = 'historial';

  //------------------------------------------------------
  static readonly ADM_UO = 'adm_uo';
  static readonly EDIT_UO = `edit`;
  static readonly EDIT_CIRAM = `edit-ciram`


  //---------------------------------------------------------------------------------------------------------- RUTAS REPORTE TALLERISTA
  static readonly REPORTES_TALLERES_TALLERISTAS = 'talleres';
}
