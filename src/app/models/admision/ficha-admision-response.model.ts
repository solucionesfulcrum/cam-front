export interface FichaAdmisionResponse{
    asegurado: DatosAseguradoFichaResponse,
    fichaAdmision: DatosFichaResponse
}

export interface DatosAseguradoFichaResponse{
    // codIpressAdscripcion,
    // departNacimiento,
    // descTipoDoc,
    // distriNacimiento,
    // idAsegurado,
    // numDoc,
    // provinNacimiento,
    // tipoDoc,
    // ubigeoNacimiento,
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
    fechMod: string,
    fechReg: string,
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
    usuarioModId: number,
    activo: number
}

export interface DatosFichaResponse {
    // idAsegurado: number, //Duda
    idUnidadOpe: number, //Duda
    idUsuarioMod?: number, //Duda
    idUsuarioReg: number,
    fechaRegistro: string,
    fechaModificacion?: string,
    estado: string,
    numHistoria: string, // temporal //Duda
    codRedAsistencial: string,
    codCentro: string,
    observacion: string,
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