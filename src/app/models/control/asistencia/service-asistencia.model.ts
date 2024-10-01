export interface RequestRegisterCabecera {
    idProgramacionDet: number,
    userCreacion: number,
}

export interface RequestRegisterDet {
    idControlAsistenciaCab: number,
    idProgramacionSubDet: number,
    numeracion: number
}

export interface RequestRegisterAsegurado {
    idControlAsistenciaDet: number,
    idFichaAdmision: number,
    conConexion: boolean,
    acreditado: boolean
}

export interface RequestCambioHorario {
    idControlAsistenciaDetActual: number,
    numeracionActual: number,
    idControlAsistenciaCabActual: number,
    idProgramacionSubDetSiguiente: number,
    numeracionSiguiente: number
}

export interface RequestRegisterAsistio {
    idProgramacionDet: number,
    idFichaAdmision: number
}

export interface AsistenciaSesion{
    idControlAsistenciaSubDet: number
}


export interface RequestAdminAsistenciasRap{
    codigoRed: string | null,
    texto: string,
    estado: number,
    fecInicio: string,
    fecFin: string,
    codigoCam: string | null,
    idRol: number,
    pageNum? : string,
    pageSize?: string,
  }
  