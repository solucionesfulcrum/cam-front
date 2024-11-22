
export interface listarServiciosRequest
{
    texto: string;
    fecInicio: string; 
    fecFin: string; 
    pageNum: string;
    pageSize: string; 
}

export interface ServicioRequest {
    idServicio?: number; 
    activo?: number;
    nombre?: string; 
    idUsuario?: number; 
    idSubPrograma?: number;
    activoAsisRap?: string; 
  }

export interface AsistenciaRapida {
    tipo: "ASISTENCIA" | "ASISTENCIA_RAPIDA";
    estado: 0 | 1; 
    idServicios: number[]; 
}

export interface ServicioListadoItem {
    idServicio: number;
    nombreServicio: string;
    fechaModificacion: string;
    fechaCreacion: string;
    subPrograma: string;
    programa: string;
    activo: number;
    activoAsistenciaRap: number;
    contContrato: number;
    contProgramacion: number;
    contAsisRap: number;
  }