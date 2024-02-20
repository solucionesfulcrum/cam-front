export interface FormatoCartilla{
    idActividad: number,
    actividadNombre: string,
    estadoCartilla: string,
    fechaCreacion: Date,
    fechaProgramadaInicio?: Date,
    fechaProgramadaFin?: Date,
    duracionAtencion?: string,
    nombrePersona?: string,
    numeroPersona?: string,
    ingresaImagen?: boolean,
    imagenBase64?: string
}