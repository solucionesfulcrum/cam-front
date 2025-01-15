export interface RequestListTalleristaAsistenciaRapida {
    idUsuario: number,
    idUnidadOperativa: number,
    fecInicio: string,
    fecFin: string,
    estado: number,
    pageNum: number,
    pageSize: number,
    idServicio: number
}