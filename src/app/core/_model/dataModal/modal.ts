export interface RegistroUsuario {
    title: string;
    data: DataUsuario;
}

export interface DataUsuario {
    guiid: string;
    email: string;
    tipoDoc?:string;
    numDoc?:string;

    idSSO: string;
    tipoUnidad: string;
    unidadOperativa: string;
}