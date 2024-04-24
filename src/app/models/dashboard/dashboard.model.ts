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

export interface RequestDatosPersonalesRegistro{
    idUsuario: number,
    nombres: string,
    apellidos: string,
    celular: string,
    codUbiDep: string,
    codUbiProv: string,
    codUbiDist: string,
    direccion: string,
    fechaNacimiento: string,
    paramEstadoCivilId: number,
    paramGeneroId: number,
    idNacionalidad: number,
    idProfesion: number,
    rne : string,
    cmp : string
}
