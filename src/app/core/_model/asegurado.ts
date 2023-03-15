import { VariablesAuditoria } from './variables-auditoria';
import { UnidadOperativa } from './unidad-operativa';

export class Asegurado extends VariablesAuditoria {
  idAsegurado: number;
  unidadOperativa: UnidadOperativa;
  estadoInscripcion: string;
  tipoDoc: number;
  numDoc: string;
  nombres: string;
  tipoDocumento: string; // Variable extra para guardar el tipo de documento en String
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccionActual: string;
  celular: string;
  telefono: string;
  correo: string;
}
