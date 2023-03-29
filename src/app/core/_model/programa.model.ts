import { SubPrograma } from './sub-programa.model';
import { VariablesAuditoria } from './variables-auditoria';

export class Programa extends VariablesAuditoria{
  idPrograma?:string;
  descripcion:string;
  subProgramas?: SubPrograma[];
}