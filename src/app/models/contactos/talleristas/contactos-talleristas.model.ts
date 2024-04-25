export interface RequestListTallerista{
    idUnidOpe: number,
    texto: string,
    pageNum: number,
    pageSize: number
}

export interface RequestListTalleristaContrato{
    idUsuario: number,
    idUnidadOperativa: number,
    texto: string,
    fecInicio: string,
    fecFin: string,
    pageNum: number,
    pageSize: number
}