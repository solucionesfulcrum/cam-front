export interface dataRequest{
    codOpcion: string,
    tipoDoc: string,
    numDoc: string
}
export interface listaFichaSolicitudRequest {
    idUnidOpe: string;
    apellidos: string;
    nombres: string;
    tipoDocIdent: string;
    numDocIdent: string;
    fecInicio: string;
    fecFin: string;
    pageNum: string;
    pageSize: string;
}
export interface listaFichaSolicitudResponse {
    code: number;
    message: string;
    data: [
        total: number,
        list: fichasResponse[],
        pageNum: number,
        pageSize: number,
        size: number,
        startRow: number,
        endRow: number,
        pages: number,
        prePage: number,
        nextPage: number,
        isFirstPage: boolean,
        isLastPage: boolean,
        hasPreviousPage: boolean,
        hasNextPage: boolean,
        navigatePages: number,
        navigatepageNums: number,
        navigateFirstPage: number,
        navigateLastPage: number,
    ]
}
export interface fichasResponse {
    id: number;
    numHistClinica: string;
    tipDocIdent: string;
    descTipDocIdent: string;
    numDocIdent: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    fecRegistro: string;
    estado: string;
}