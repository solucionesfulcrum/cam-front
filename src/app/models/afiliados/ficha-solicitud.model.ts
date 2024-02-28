export interface listaConstactosRequest {
    idUnidOpe: string;
    apellidos: string;
    nombres: string;
    tipoDocIdent: string;
    numDocIdent: string;
    fecInicio: string;
    fecFin: string;
    pageNum: string;
    pageSize: string;
}

export interface RequestListaSolicitudesAfiliados{
    idUnidOpeCam: number,
    texto: string,
    fecInicio: string,
    fecFin: string,
    pageNum: string,
    pageSize: string,
    estado: number
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

export interface dataRequest{
    codOpcion: string,
    tipoDoc: string,
    numDoc: string
}

export interface listaFichaSolicitudRequest {
    idUnidOpe: string;
    apellidos: string;
    nombres: string;
    tipoDocIdent: string;
    numDocIdent: string;
    fecInicio: string;
    fecFin: string;
    pageNum: string;
    pageSize: string;
}


