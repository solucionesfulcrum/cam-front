
export interface ResponseLogin{
    code: number;
    message: string | null;
    data: {
        auth: {
            id: string; 
            accessToken: string; 
            refreshToken: string; 
        },
        data: {
            tipoDoc : '1' | '2' | '3',
            numDoc: string;
            nombres:string; 
            email: string;
            roles: []
        },
        info: {
            codOriCentro : string ,
            codRed: string,
            codCentro: string,
            tipo: number 
        },
        oficina: null
    }
}

export interface ResponseLoginSSO{
    code: number,
    message: string,
    data: {
        id: string;
        accessToken: string;
        refreshToken: string;
        idUserApp: number
    },
}