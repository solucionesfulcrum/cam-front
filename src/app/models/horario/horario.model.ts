export interface RequestListHorarios{
    fecInicio: string,
    fecFin: string,
    texto: string,
    estado: number,
    unidOperativaId: number,
    pageNum: number,
    pageSize: number
}

export interface RequestCreateHorarioAdminis{
    mesId: number,
    anio: number,
    usuarioId: number,
    unidOperativaId: number,
    horarioDet: RequestHorarioDetalle[]
}

export interface RequestHorarioDetalle{
    profesionalId: number,
    paramRegimenId: number,
    horasXMes: number,
    horasVacaciones: number
}

export interface RequestCreateHorario{
    mes: string,
    anio: string,
    listPorfesionales: CreateHorarioProfesional[],
}

export interface CreateHorarioProfesional{
    horasMes: number,
    horasVacaciones: number,
    idProfesional: number,
    nomProfesional: string,
    regimen: string,
    horasProgramadas?: number,
    actividadesAsignadas?: any[]
}

export interface RequestRegisterAtencion{
    idHorario: number,
    idProfesional: number,
    horaInicioAsignacion: Date,
    horaFinAsignacion: Date,
    actividadRegistrada: string
}

export interface StoreAsignacionProfesional{
    horarioPlanificacionId: number,
    actividadId: number,
    actividadNombre: string,
    fecha: string,
    horaInicio: string,
    horaFin: string,
    numeroCupos: number,
    duracionActividad: number
}