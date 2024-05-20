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
    marcar: boolean;
    orden: number;
    nombres: string;
    tipDoc: string;
    numDoc: string;
    horaAsis: string;
    estadoAsistente: string;
  }
