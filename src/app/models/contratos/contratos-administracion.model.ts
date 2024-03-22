export interface RequestSearchUser{
    tipoDoc: string,
    numDoc: string,
}

export interface RequestSendCabeceraContrato{
    cabecera: ContratoCabecera,
    detalle: ContratoDetalle[]
}

export interface ContratoCabecera{
    idUsuarioTallerista: number,
    numOc: string,
    fechaInicio: string,
    fechaFin: string,
    monto: number,
    usuarioRegId: number
}

export interface ContratoDetalle{
    idUnidadOperativa: number,
    tipoOrigenUnidad: string,
    fechaRegistroUo?: string,
    subDetalle?: ContratoSubDetalle[]
}

export interface ContratoSubDetalle{
    idServicio: number,
    paramServicioTipoId: number,
    fechaInicio: string,
    fechaFin: string,
    paramModalidadId: number
}