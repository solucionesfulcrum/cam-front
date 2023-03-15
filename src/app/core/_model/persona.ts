import { UnidadOperativa } from './unidad-operativa';
import { VariablesAuditoria } from './variables-auditoria';

export class Persona extends VariablesAuditoria {
  idPersona: number;
  unidadOperativa: UnidadOperativa;
  tipoDoc: number;
  numDoc: string;
  nombres: string;
  apePaterno: string;
  apeMaterno: string;
  celular: string;
  ubiGeodirecc: string;
  correo: string;
  fecIngreso: string;
}
