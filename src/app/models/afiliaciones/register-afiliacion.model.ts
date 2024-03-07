export interface RegisterSolicitud {
  appOrigen: string,
  nombres: string,
  apePaterno: string,
  apeMaterno: string,
  tipoDoc: string,
  tipoDocDesc: string,
  numDoc: string,
  celular: string,
  correo: string,
  direccion: string,
  ubigeoDireccion: string,
  idUnidOpeCam: number,
  fecNacimiento: string,
  codEstCivil: string,
  descEstCivil: string,
  codIpress: string,
  descIpress: string,
  textSolicitud: string,
  usuarioRegId: number
}

export interface RegisterNota{
  idFichaAdmision: number,
  nota: string,
  idUsuarioReg: number
}