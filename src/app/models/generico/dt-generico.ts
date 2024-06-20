export interface DtGenerico<T> {
    data : {
        list : T[],
        pageNum : number,
        pageSize : number,
        total: number,
    },
    code: number,
    message: string
}
