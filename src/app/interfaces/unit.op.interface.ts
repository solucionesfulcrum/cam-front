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

export interface iUserTable{
  guiid: string
  usuario: string
  nombres: string
  email: string
  tieneVigencia: boolean
  fecIniVigencia: string
  fecFinVigencia: string
}

//ESTATICOS
interface Data {
  list: UnidadOperativa[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface DataResponse<T> {
  data: Data;
}

export interface UnidadOperativa {
  id: number;
  unidad: string;
  categoria: string;
  telefono: string;
  distrito: string;
  red: string;
  fechaRegistro: Date;
}

export interface UnidadOperativaCiram {
  id: number;
  unidad: string;
  categoria: string;
  telefono: string;
  distrito: string;
  red: string;
  fechaRegistro: Date;
}
