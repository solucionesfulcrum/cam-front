export interface RequestListUsers{
  texto: string,
  fecInicio: string,
  fecFin: string,
  estado: string,
  pageNum: number,
  pageSize: number
}

export interface ActivateUserSigps{
  usuarioId: number,
  rolId: number,
  fechInicio: string,
  fechFin: string,
  unidOperativaId: number,
  usuarioRegId: number
}

export interface ActivateUserSSO{
  guiid: string,
  fechaInicio: string,
  fechaFin: string,
  observacion: string
}