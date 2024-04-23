export interface listardashboardRequest{
    idUnidadOperativa: number,
    fecInicio: string,
    fecFin: string
}

export interface listardashboardRequestActivos{
    idUnidadOperativa: number,
    fecInicio: string,
    fecFin: string,
    estado: number
}

export interface listCiramActivosInactivos{
    idUnidadOperativa: number,
    fecInicio: string,
    fecFin: string,
    texto: string
}
