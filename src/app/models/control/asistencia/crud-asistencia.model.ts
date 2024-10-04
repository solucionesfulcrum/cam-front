export interface RequestBuscarApto {
    idUnidadOperativa: number,
    tipDoc: string,
    numDoc: string
}

export interface RequestBuscarAptoNacional {
  tipDoc: string,
  numDoc: string,
  fechaNacimiento?: string | null,
}

//ESTATICOS
interface Data {
    list: AsistenciaLista[];
    pageNum: number;
    pageSize: number;
    total: number;
  }

  interface DataAsistenciaRapida {
    list: AsistenciaRapidaLista[];
    pageNum: number;
    pageSize: number;
    total: number;
  }
  
  export interface DataResponse<T> {
    data: Data;
  }

  export interface DataResponseAsistenciaRapida<T> {
    data: DataAsistenciaRapida;
  }

  
  export interface AsistenciaLista {
    idInscripcion: number;
    marcar: boolean;
    orden: number;
    
    nombreCompleto: string;
    birthday : false;
    fechaReg: string;
    aseguradoNuevo: false;
    tipoDoc: string;
    numDoc: string;
  }

   
  export interface AsistenciaRapidaLista {
    idAsisRapidDet: number;
    idAsegurado: number;
    marcar: boolean;
    orden: number;
    
    nombre: string;
    fechaRegistro: string;
    tipoDoc: string;
    descTipoDoc: string;
    numDoc: string;
  }
