export interface ProgramacionRequestListContratos {
  idUnidOpe: number,
  texto: string,
  fecInicio: string,
  fecFin: string,
  estado: number,
  pageNum: number,
  pageSize: number
}

export interface ProgramacionRequestRegisterServicio {
  idProgramacion: number,
  fecha: string,
  detalles: DetallesServicio[]
}

export interface DetallesServicio {
  idServicio: number,
  horaInicio: string,
  horaFin: string,
  nroSesiones: number,
  duracion: number,
  paramServicioTipoId: number,
  idUoCiram: number,
  ubicacion: string
}