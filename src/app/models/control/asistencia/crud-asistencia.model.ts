export interface RequestBuscarApto {
    idUnidadOperativa: number,
    tipDoc: string,
    numDoc: string
}

//ESTATICOS
interface Data {
    list: AsistenciaLista[];
    pageNum: number;
    pageSize: number;
    total: number;
  }
  
  export interface DataResponse<T> {
    data: Data;
  }

  
  export interface AsistenciaLista {
    idInscripcion: number;
    marcar: boolean;
    orden: number;
    
    nombreCompleto: string;
    birthday : false;
    horaAsistencia: string;
    aseguradoNuevo: false;
    tipoDoc: string;
    numDoc: string;
  }
