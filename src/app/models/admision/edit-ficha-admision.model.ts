export interface RequestEditFicha{
    asegurado: EditAseguradoAdmision,
    fichaAdmision: EditFichaAdmision
}

export interface EditAseguradoAdmision{
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
    fecNacimiento: string,
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
    usuarioModId: number, 
    foto: string,
    fecFallecimiento: string
}

export interface EditFichaAdmision{
    idUnidadOpe: number,
    codRedAsistencial: string,
    codCentro: string,
    observacion: string,
    idUsuarioMod: number,
    direccion: EditDireccionesAdmision[],
    datosContacto: EditContactoAdmision,
    datosProcedencia: EditProcedenciaAdmision,
    datosAcompaniante: EditAcompanianteAdmision
}

export interface EditDireccionesAdmision{
    paramTipoId: number,
    direccion: string,
    pisoNumDep?: string,
    codUbiDep: string,
    codUbiProv: string,
    codUbiDist: string,
    activo: number
}

export interface EditContactoAdmision{
    telefono: string,
    celular: string,
    tieneWhatsapp: string,
    correo: string
}

export interface EditProcedenciaAdmision{
    paramModIngresoId: number,
    modalidadIngreso: EditModalidadAdmision
}

export interface EditModalidadAdmision{
    tipoModalidad: string,
    codIpres?: string,
    codCerps?: string,
    codMbrps?: string,
    nomIpres?: string,
    nomCerps?: string,
    nomMbrps?: string
}

export interface EditAcompanianteAdmision{
    requiereApoyo: string,
    paramParentescoId?: number,
    paramTipoDocId?: number,
    nroDocumento?: string,
    nombres?: string,
    apellidos?: string,
    telefono?: string,
    celular?: string,
    tieneWhatsapp?: string,
    correo?: string
}