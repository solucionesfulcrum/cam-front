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
    datosProcedencia: procedenciaFicha
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
    idModIngresoParam: number,
    modalidadIngreso?: modalidadIngreso
}

export interface modalidadIngreso {
    tipoModalidad: string,  // DERIVACION_IPRES, OTRA_UNID_OPE_CERPS,OTRA_UNID_OPE_MPRPS
    codIpres?: string,
    codCerps?: string,
    codCam?: string,
    nomIpres?: string,
    nomCerps?: string,
    nomCam?: string
}