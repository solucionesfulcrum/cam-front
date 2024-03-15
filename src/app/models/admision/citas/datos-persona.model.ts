export interface generateFirstAttentionRequest{
    fichaAdmisionId: number,
    unidOperativaId: number,
    usuarioId: number
}

export interface getBandejaCitasRequest{
    texto : string,
    proceso : string,
    estado : string,
    unidOperativaId: number,
    pageNum : number,
    pageSize: number
}