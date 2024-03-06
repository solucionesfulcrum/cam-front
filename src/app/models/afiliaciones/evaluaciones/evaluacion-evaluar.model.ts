export interface RequestEvaluacionRespuestas {
  idFichaAdmision: number,
  idUnidadOperativa: number,
  pagina: number
}

export interface RequestRegisterAnswersEvaluacion{
  cabecera: RegisterAnswersHeader,
  detalle: RegisterAnswersUnit[]
}

export interface RegisterAnswersHeader{
  idFichaAdmision: number,
  idUnidadOperativa: number,
  pagina: number
}

export interface RegisterAnswersUnit{
  tipoCuestionario: string,
  idCuestionario: number,
  respuesta1: number,
  respuesta2: number
}