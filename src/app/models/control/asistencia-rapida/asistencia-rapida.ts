export interface ItemListaAsistenciaRapida{
    idAsisRapido : number,
    descripcion : String,
    fecha : String,
    modalidad : String,
    presupuesto : String,
    sesiones : number,
    horaIni : String,
    horaFin : String,
    estado : String
}

export interface ItemListaAsistenciaRapidaNacional{
    idAsisRapido : number,
    descripcion : String,
    fecha : String,
    modalidad : String,
    presupuesto : String,
    sesiones : number,
    horaIni : String,
    horaFin : String,
    estado : String,
    red : String,
    cam : String,
    personal : String,
    asegurado : String,
    unidadOperativa : String,
}