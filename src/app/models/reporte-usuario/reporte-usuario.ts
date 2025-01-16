export interface ReporteUsuario{
    idReporteUsuario: number,
    nombreReporte: string,
    idRecurso: string,
    fechReg:string 
}

export interface SubReporteUsuario{
  idReporteUsuarioAgrupado: number;
  idRecurso: string;
  estado: "INICIADO" | "FINALIZADO"; // Enum restringido a los posibles valores
  error: boolean;
  nombreReporte: string;
  fechReg: string; // Formato ISO 8601
  fechFin: string; // Formato ISO 8601
  obsGeneracion: string;
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
  