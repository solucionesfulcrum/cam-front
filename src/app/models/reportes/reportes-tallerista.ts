export interface ReportesTalleristaPayload {
    idUsuario: string,
    idUnidadOperativa: string,
    texto: string,
    fecInicio: string,
    fecFin: string,
    estado: string,
    pageNum: number,
    pageSize: number,
}

export interface itemReporteTallerista{
    nombreTaller: string,
    fechaTaller: string,
    horaInicio: string,
    horaFin: string,
    numeroSesiones: number,
    estado: string,
    idUsuario: number,
    idUnidadOperativa: number
}