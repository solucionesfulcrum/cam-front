export interface ReporteUsuario{
    idReporteUsuario: number,
    nombreReporte: string,
    idRecurso: string,
    fechReg:string 
}

export interface ReporteUsuarioRegistrarRequest {
    idUsuario: number;
    nombreReporte: string;
    idRecurso: string;
  }
  
  export interface ReporteUsuarioEditarRequest {
    idUsuario: number;
    nombreReporte: string;
    idRecurso: string;
  }
  
  export interface ReporteUsuarioDescargaResponse {
    nombreArchivo: string;
    data: Blob; // Tipo de dato para manejo de archivos binarios
  }
  
  export interface ResponseDto<T> {
    code: string;
    message: string;
    data: T;
  }
  