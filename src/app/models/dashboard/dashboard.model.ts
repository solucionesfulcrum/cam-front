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

export interface RequestCiramRegistro{
    codigoUoCiram: string,
    idUnidadOperativaCam: number,
    activo: number,
    nombreCiram: string,
    userCreacion: string,
    correo: string,
    direccion: string,
    distrito: string,
    lider: string,
    celular: string,
    tipo: string
}
