export interface FormatoBoton{
    texto: string,
    colorBtn?: 'success' | 'primary' | 'danger' | 'light' | 'cancel' | 'sky' | "white" | "mezclado" | "transparente" | "bordeado" | "none",
    tooltip?: string,
    esImagen?: boolean,
    rutaIcono?: string,
    deshabilitado?: boolean,
    loading?: boolean,
}