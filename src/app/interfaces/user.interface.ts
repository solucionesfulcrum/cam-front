export interface iUser {
  tipoDoc: '1' | '2' | '3'
  numDoc: string
  nombres: string
  email: string
  roles: Role[]
}

export interface Role {
  codigo: string
  nombre: string
}
