import { VariablesAuditoria } from './variables-auditoria';

export class Parametro extends VariablesAuditoria {
  idParametro: number;
  tipo: string;
  padre: number;
  nombre: string;
  descripcion: string;
}
