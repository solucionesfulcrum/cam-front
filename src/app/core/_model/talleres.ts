import { Tallergrupo } from './tallergrupo';
import { VariablesAuditoria } from './variables-auditoria';

export class Talleres extends VariablesAuditoria {
  idTaller: number;
  tallergrupo: Tallergrupo;
  codTaller: string;
  descTaller: string;
  estado: string;
}
