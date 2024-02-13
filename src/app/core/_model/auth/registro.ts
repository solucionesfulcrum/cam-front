import { Cam } from "../cam.model";

export interface RegistroUsuario {
    tipDocIden?: string | null;
    numDocIden?: string | null;
    password?: string | null;
    email?: string | null;
    nombres?: string | null;
    codigoPlanilla?: string | null;
    accept:boolean | null;
    unidadOperativa? : string | null;
}

export interface ResponseRegistro {
    codResult: number;
    data?: string;
    message: string;
}

export interface CompletoRegistro {
    guiid: string;
    codigo: string;
    numDoc: string;
}