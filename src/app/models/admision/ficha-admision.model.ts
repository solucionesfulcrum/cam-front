export interface dataRequest{
    codOpcion: string,
    tipoDoc: string,
    numDoc: string
}
export interface listaFichaAdmisionRequest {
    idUnidOpe: string;
    texto: string;
    fecInicio: string;
    fecFin: string;
    pageNum: string;
    pageSize: string;
    estado?: number;
}
export interface listaFichaAdmisionResponse {
    code: number;
    message: string;
    data: [
        total: number,
        list: fichasResponse[],
        pageNum: number,
        pageSize: number,
        size: number,
        startRow: number,
        endRow: number,
        pages: number,
        prePage: number,
        nextPage: number,
        isFirstPage: boolean,
        isLastPage: boolean,
        hasPreviousPage: boolean,
        hasNextPage: boolean,
        navigatePages: number,
        navigatepageNums: number,
        navigateFirstPage: number,
        navigateLastPage: number,
    ]
}
export interface fichasResponse {
    id: number;
    numHistClinica: string;
    tipDocIdent: string;
    descTipDocIdent: string;
    numDocIdent: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    fecRegistro: string;
    estado: string;
}

export interface registerFichaRequest{
    asegurado: datosAseguradoFicha,
    fichaAdmision: datosFicha
}

export interface datosAseguradoFicha{
    tipDocIdent: string,
    descTipDocIdent: string,
    numDocIdent: string,
    nombres: string,
    apePaterno: string,
    apeMaterno: string,
    departNacim: string,
    provinNacim: string,
    distriNacim: string,
    ubigeoNacim: string,
    fecNacimiento: string, // yyyy-mm-dd with 0
    codEstCivil: string,
    descEstCivil: string,
    codSexo: string,
    descSexo: string,
    codTipoAsegurado: string,
    descTipoAsegurado: string,
    codTipoSeguro: string,
    descTipoSeguro: string,
    codIpressAdscrip: string,
    nomIpressAdscrip: string,
    codRedAsisten: string,
    nomRedAsisten: string,
    usuarioRegId: number,
    activo: number,
    foto: string,
    fecFallecimiento?: string,
}

export interface datosFicha {
    // idAsegurado: number, //Duda
    idUnidadOpe: number, //Duda
    numHistClinica: string, // temporal //Duda
    codRedAsistencial: string,
    codCentro: string,
    observacion: string,
    idUsuarioReg: number,
    activo: number,
    direccion: direccionFicha[],
    datosContacto: contactoFicha,
    datosProcedencia: procedenciaFicha,
    datosAcompaniante: acompanianteFicha
}

export interface direccionFicha {
    paramTipoId: number,
    direccion: string,
    pisoNumDep?: string,
    codUbiDep: string,
    codUbiProv: string,
    codUbiDist: string,
    descUbiDep: string,
    descUbiProv: string,
    descUbiDist: string,
    activo: number  //1: seleccionado, 0: no seleccionado
}

export interface contactoFicha {
    telefono: string,
    celular: string,
    tieneWhatsapp: string, // SI / NO 
    correo: string
}

export interface procedenciaFicha {
    paramModIngresoId: number,
    modalidadIngreso?: modalidadIngreso
}

export interface modalidadIngreso {
    tipoModalidad: string,  // DERIVACION_IPRES, OTRA_UNID_OPE_CERPS,OTRA_UNID_OPE_MPRPS
    codIpres?: string,
    codCerps?: string,
    codMbrps?: string,
    nomIpres?: string,
    nomCerps?: string,
    nomMbrps?: string
}
export interface acompanianteFicha {
    requiereApoyo: string, // SI / NO 
    paramParentescoId?: number,
    paramTipoDocId?: number,
    nroDocumento?: string,
    nombres?: string,
    apellidos?: string,
    telefono?: string,
    celular?: string,
    tieneWhatsapp?: string, // SI / NO 
    correo?: string
}

export interface ubicacionGeo{
    nombreUbicacion: string,
    codUbigeo: string,
    codUbiDep: string,
    codUbiProv: string,
    codUbiDistr: string
}