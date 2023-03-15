import { VariablesAuditoria } from './variables-auditoria';
import { Programa } from './programa.model';

export class Tallergrupo extends VariablesAuditoria {
  idTallerGrupo: number;
  programa: Programa;
  descTallerGrupo: string;
  codTallerGrupo: string;
}
