export interface PreRecoverPassword {
  usuario: string
}

export interface RecoverPassword {
  usuario: string,
  codigo: string,
  password: string
}