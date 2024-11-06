export interface RequestSearchUser{
    tipoDoc: string,
    numDoc: string,
}

export interface RequestSendCabeceraContrato{
    cabecera: ContratoCabecera,
    detalle: ContratoDetalle[]
}

export interface RequestEditCabecera{
    idUsuarioTallerista: number,
    numOc: string,
    fechaInicio: string,
    fechaFin: string,
    nroEntregables: number,
    monto: number,
    usuarioModId: number
}

export interface RequestListContracts{
    idUnidOpe: number,
    texto: string,
    fecInicio: string,
    fecFin: string,
    estado: number,
    pageNum: number,
    pageSize: number
}

export interface RequestSaveClase{
    fecha : string,
    horaInicio : string,
    horaFin : string,
    idServicio : number,
    idunidadOperativa : number,
    idUsuario : number,
    sesion : number,
    cifra: number,
    modalidad : string, //VIRTUAL
    presupuesto : string //COFINANCIADO
    idRol?: number
}

export interface ResponseSaveClase{
    idAsisRapid: number,
    fecha : string,
    horaInicio : string,
    horaFin : string,
    idServicio : number,
    idunidadOperativa : number,
    idUsuario : number,
    sesion : number,
    modalidad : string, //VIRTUAL
    presupuesto : string //COFINANCIADO
}

export interface ContratoCabecera{
    tipoOrigen: string,
    idUnidadOperativa: number,
    idUsuarioTallerista: number,
    numOc: string,
    fechaInicio: string,
    fechaFin: string,
    nroEntregables: number,
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

export interface RequestContratoDetalle{
    numOc: string,
    detalle: ContratoDetalle[]
}