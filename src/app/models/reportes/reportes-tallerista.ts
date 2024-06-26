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

export interface ItemReporteTallerista{
    nombreTaller: string,
    fechaTaller: string,
    horaInicio: string,
    horaFin: string,
    numeroSesiones: number,
    estado: string,
    idUsuario: number,
    idUnidadOperativa: number
}

export interface ItemReporteAsistenciaTaller{
    index: number,
    asegurado: string,
    documento: string,
    nroDocumento: string,
    horaAsistencia: string,
    nuevo: boolean,
    cumpleAnio: boolean,
    idUsuario: number,
    idUnidadOperativa: number
}

export interface CabeceraAsistenciaReporte{
    idProgDet: number,
    fechaServicio: string,
    nombreServicio: string,
    numSesiones: number,
    horaInicio: string,
    horaFin: string,
    idControlAsistenciaCab: number,
    cerradoCabecera: boolean,
    listaProgSubDet: SesionesCabecera[]
}

export interface SesionesCabecera{
    numeracion: number,
    idProgSubDet: number,
    horaInicio: string,
    horaFin: string,
    cerradoAsistencia: boolean,
    cursor: boolean,
    idControlAsistenciaDet: number,
    countAsistencia: number
}

export interface AsistenciaTaller{
    
    idControlAsistenciaSubDet: number,
    asegurado: string,
    tipDocumento: string,
    nroDocumento: string,
    fechaHoraAsistencia: string
    continuaTaller: boolean,
    cumpleAnio: boolean,
    nuevo: boolean,
    conConexion: boolean,
    acreditado: boolean,
    agregadoFueraDeFecha: boolean
}
