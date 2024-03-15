export interface direccionFichaFront{
    paramTipoId: number,
    nomParametro: string,
    direccion: string,
    pisoNumDep?: string,
    codDep: string,
    codProv: string,
    codDist: string,
    nomDep: string,
    nomProv: string,
    nomDist: string,
    activo: number
}

export interface AcompanianteData {
  siEnvia?: boolean;
  parentesco: string;
  tipoDoc: string;
  nroDoc: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  celular: string;
  wsp: string;
}

export interface regionData {
  region: string;
  codigo: string;
}

export interface ipressData {
  establecimiento: string,
  ubigeoDescripcion: string,
  ubigeo: string
}

export interface modalidadIngData {
  idUnidOperativa: number,
  idProfesional: any,
  idCamCiram: string,
  codUbigeo: number,
  nombre: string,
  direccion: string,
  telefono: string,
  idUsuarioReg: number,
  idUsuarioMod: number,
  fechaReg: string,
  fechaMod: string,
  activo: number
}