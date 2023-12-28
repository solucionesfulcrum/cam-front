export interface FormatoBoton{
    texto: string,
    colorBtn?: 'success' | 'primary' | 'danger' | 'light' | 'cancel' | 'sky' | "white" | "mezclado" | "bordeado" | "none",
    esImagen?: boolean,
    rutaIcono?: string,
    deshabilitado?: boolean,
    loading?: boolean,
}