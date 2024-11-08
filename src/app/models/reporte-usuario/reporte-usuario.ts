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
  
  
  export interface ReportesGeneradosRequest{
      texto: string,
      fecInicio: string,
      fecFin: string,
      estado?: string,
      idUsuario: number,
      pageSize: number,
      pageNum: number
  }
  