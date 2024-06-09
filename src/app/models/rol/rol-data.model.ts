export interface RolData{
  idRol: number,
  nombre: string,
  usuarioRegId: number,
  usuarioModId: number,
  fechReg: string,
  fechMod: string,
  activo: number
}

export interface RolPemisos {
  descripcion: string;
  estado: boolean;
  children?: {descripcion: string, estado: boolean}[]
}