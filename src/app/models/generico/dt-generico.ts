export interface DtGenericoPaginado<T> {
    data : {
        list : T,
        pageNum : number,
        pageSize : number,
        total: number,
    },
    code: number,
    message: string
}

export interface DtGenericoSinPaginar<T> {
    data : T,
    code: number,
    message: string
}


export interface ResponseGenerico<T> {
    data : T,
    code: number,
    message: string
}