export interface TipoParametro{
    code: number;
    message: string;
    data: Parametro[]
}
export interface Parametro{
    idParametros: number,
    tipo: string,
    idPradre: number,
    nombre: string,
    valor1: string,
    valor2: string,
    descripcion: string,
    fechaRegistro: string,
    fechaModificacion: string,
    activo: boolean
}

export interface ParamMenu{
    texto: string,
    svgDir: string
}