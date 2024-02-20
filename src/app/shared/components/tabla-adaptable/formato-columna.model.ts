export interface FormatoColumna{
    header?: string,
    tipo?: 'texto' | 'select' | 'inputText' | 'inputNumber' | 'typeAndSelect',
    opciones?: TablaOpciones[],
    nomAttribute: string,
    oculto?: boolean
}

export interface TablaOpciones{
    idOpcion: number,
    nombre: string,
    value: any,
    desactivado?: boolean
}