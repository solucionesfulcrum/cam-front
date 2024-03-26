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
