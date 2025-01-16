export interface RequestListOperaciones {
  idFichaAdmision: number,
  fecInicio: string,
  fecFin: string,
  pageNum: number,
  pageSize: number
}

export interface RequestListEvaluaciones {
  idFichaAdmision: number,
  idUnidadOperativa: number,
  fecInicio: string,
  fecFin: string,
}
