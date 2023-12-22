export interface RequestListaSolicitudesAfiliados{
    tipoSolicitud: string,
    unidadOperativa: number,
    fechaInicio: string,
    fechaFin: string,
    buscar: string
}

export interface RequestListaSAfiliadosContacto{
    estado?: any,
    fechaInicio: string,
    fechaFin: string,
    buscar: string
}

export interface direccionFichaFront{
    paramTipoId: number,
    nomParametro: string,
    direccion: string,
    pisoNumDep?: string,
    codDep: string,
    codProv: string,
    codDist: string,
    nomDep: string,
    nomProv: string,
    nomDist: string,
    activo: number
}