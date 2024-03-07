export interface RequestEvaluacionRespuestas {
  tipoEvaluacion: string,
  idOrigen: number,
  idUnidadOperativa: number,
  pagina: number
}

export interface RequestRegisterAnswersEvaluacion{
  cabecera: RegisterAnswersHeader,
  detalle: RegisterAnswersUnit[]
}

export interface RegisterAnswersHeader{
  tipoEvaluacion: string,
  idOrigen: number,
  idUnidadOperativa: number,
  pagina: number
}

export interface RegisterAnswersUnit{
  tipoCuestionario: string,
  idCuestionario: number,
  respuesta1: number,
  respuesta2: number
}

export interface RequestResultsEvaluacion{
  tipoEvaluacion: string,
  idOrigen: number,
  idFichaAdmision: number,
  idUnidadOperativa: number
}

export interface SendDataResultado{
  tipoEvaluacion: string,
  idOrigen: number,
  idUnidadOperativa: number,
  admitido: boolean,
  comentario: string
}