export interface DatosPerfilCiram {
    nombre: string,
    idCentro: string,
    tipo: string,
    fechaIncripcion: string,
    direccion: string,
    distrito: string,
    nombreCam: string,
    nombreRed : string,
    lider: string,
    celular: string,
    estado: number,
    correo: string,
}

export interface Afiliados{
    nombreUsuario: string,
    fechaInicio: string,
    fechaFin: string,
    rol: string,
    estado: number,
}

export interface RequestAdminAseguradosCam{
    idUnidOpe: number,
    texto: string,
    estado: number,
    fecInicio: string,
    fecFin: string,
    codigoCam: string | null,
    pageNum? : string,
    pageSize?: string
  }

  export interface RequestAdminAseguradosCamExcel{
    idUnidOpe: number,
    texto: string,
    estado: number,
    fecInicio: string,
    fecFin: string,
    codigoCam: string | null,
  }
  


