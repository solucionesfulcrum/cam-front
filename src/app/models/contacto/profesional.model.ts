export interface RequestBandejaProfesional{
    texto: string,
    activo: string,
    unidOperativaId: number,
    pageNum: number,
    pageSize: number
}

export interface RequestAsignarProcesos{
    usuarioId: number,
    procesos: number[],
    horasMensuales: number
}