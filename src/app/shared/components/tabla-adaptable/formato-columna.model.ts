export interface FormatoColumna{
    header?: string,
    tipo?: 'texto' | 'select' | 'inputText' | 'inputNumber' | 'typeAndSelect' | 'inputFecha',
    opciones?: TablaOpciones[],
    placeholder?: string,
    optTypeSelect?: FormatoTypeAndSelect[],
    nomAttribute: string,
    oculto?: boolean,
    resaltado?: boolean,
    obligatorio?: boolean,
    ancladoFecIni?: string,
    entity?: Entity,
    disabled?: boolean,
    affects?: Affects
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
    param1?: string,
    param2?: string,
    param3?: string,
}

export interface Entity{
    unique: boolean,
    pk: string,
    uniqueErrorMsg?: string,
}

export interface Affects{
    nomAttributeFk: string,
    paramValueFk: string,
    defaultValue: string
}