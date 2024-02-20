export interface RequestRegisterSIGPS {
  correo: string;
  categoria: string;
  tipoDoc: string;
  numDoc: string;
  nombres: string;
  codPlanilla: string;
  unidOperativaId: number;
  guiidSso: string;
}

export interface ResponseRegisterSSO {
  correo: string;
  tipoDoc: string;
  numDoc: string;
  nombres: string;
  codPlanilla: string;
  unidOperativaId: number;
  guiidSso: string;
}