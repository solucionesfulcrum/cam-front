export interface RequestEditFicha{
    asegurado: EditAseguradoAfiliado,
    fichaAdmision: EditFichaAsegurado
}

export interface EditAseguradoAfiliado{
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
    fecFallecimiento: string,
}

export interface EditFichaAsegurado{
    idUnidadOpe: number,
    codRedAsistencial: string,
    codCentro: string,
    observacion: string,
    idUsuarioMod: number,
    direccion: EditDireccionesAsegurado[],
    datosContacto: EditContactoAsegurado,
    datosProcedencia: EditProcedenciaAsegurado
}

export interface EditDireccionesAsegurado{
    paramTipoId: number,
    direccion: string,
    pisoNumDep?: string,
    codUbiDep: string,
    codUbiProv: string,
    codUbiDist: string,
    descUbiDep: string,
    descUbiProv: string,
    descUbiDist: string,
    activo: number,
}

export interface EditContactoAsegurado{
    telefono: string,
    celular: string,
    tieneWhatsapp: string,
    correo: string
}

export interface EditProcedenciaAsegurado{
    idModIngresoParam: number,
    modalidadIngreso: EditModalidadAsegurado
}

export interface EditModalidadAsegurado{
    tipoModalidad: string,
    codIpres?: string,
    codCerps?: string,
    codCam?: string,
    nomIpres?: string,
    nomCerps?: string,
    nomCam?: string
}