
export interface listarServiciosRequest
{
    texto: string;
    fecInicio: string; 
    fecFin: string; 
    pageNum: string;
    pageSize: string; 
    activo: number;
    activoAsisRap: number;
}


export interface listarSubProgramasRequest
{
    texto: string;
    fecInicio: string; 
    fecFin: string; 
    pageNum: string;
    pageSize: string; 
}


export interface listarProgramasRequest
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
    idSubPrograma: number;
    programa: string;
    paramTipoServicio: number;
    activo: number;
    activoAsistenciaRap: number;
    contContrato: number;
    contProgramacion: number;
    contAsisRap: number;
    marcar?: boolean;
  }

//SUBPROGRAMAS
export interface SubprogramaListadoItem {
  idSubPrograma: number,
  nombreSubPrograma: string,
  fechaModificacion: string,
  fechaCreacion: string,
  activo: number,
  idPrograma: number,
  nombrePrograma: string,
  marcar?: boolean
}

//PROGRAMAS
export interface ProgramaListadoItem {
  idPrograma: number,
  nombrePrograma: string,
  fechaModificacion: string,
  fechaCreacion: string,
  activo: number,
  marcar?: boolean
}

//EDICION DE SERVICIO
export interface EditarServicioRequestDto {
  idServicio: number; // ID del servicio
  activo?: number; // Estado de actividad del servicio (activo o inactivo)
  nombre?: string; // Nombre del servicio
  idUsuario?: number; // ID del usuario asociado
  idSubPrograma?: number; // ID del subprograma al que pertenece
  paramTipoServicio?: number; // El campo 'idSubPrograma' es obligatorio
  activoAsisRap?: number; // Estado de asistencia rápida (activo o inactivo)
}

export interface RegistrarServicioRequestDto {
  idServicio: number; // El campo 'idServicio' es obligatorio
  activo: number; // El campo 'activo' es obligatorio
  nombre: string; // El campo 'nombre' es obligatorio
  idUsuario: number; // El campo 'idUsuario' es obligatorio
  idSubPrograma: number; // El campo 'idSubPrograma' es obligatorio
  paramTipoServicio: number; // El campo 'idSubPrograma' es obligatorio
  activoAsisRap?: number; // Campo opcional
}

export interface SubProgramaCrearRequestDto {
  nombre: string; // Nombre del subprograma
  usuarioRegId: number; // ID del usuario que registra
  idPrograma: number; // ID del programa al que pertenece
}

export interface SubProgramaEditarRequestDto {
  nombre: string; // Nombre del subprograma
  idPrograma: number; // ID del programa al que pertenece
  usuarioModId: number;
  activo: number;
}

export interface ProgramaCrearRequestDto {
  nombre: string; // Nombre del subprograma
  usuarioRegId: number; // ID del programa al que pertenece
}

export interface ProgramaEditarRequestDto {
  nombre: string; // Nombre del subprograma
  activo: number;
  usuarioModId: number;
}

