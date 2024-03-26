export interface FormatoColumna{
    header?: string,
    tipo?: 'texto' | 'select' | 'inputText' | 'inputNumber' | 'typeAndSelect' | 'inputFecha',
    opciones?: TablaOpciones[],
    optTypeSelect?: FormatoTypeAndSelect[],
    nomAttribute: string,
    oculto?: boolean,
    resaltado?: boolean
}

export interface TablaOpciones{
    idOpcion: number,
    nombre: string,
    value: any,
    desactivado?: boolean
}

export interface FormatoTypeAndSelect{
    idOpcion: number,
    nombre: string
}