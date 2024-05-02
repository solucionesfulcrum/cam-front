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

export interface ServiciosOrdenados {
  idUnid: number,
  nomUnid: string,
  servicios: Servicio[]
}

export interface Servicio{
  idServicio: number,
  nombreServicio: string,
  tipoServicio: string,
  idUnid: number,
  nomUnid: string
}