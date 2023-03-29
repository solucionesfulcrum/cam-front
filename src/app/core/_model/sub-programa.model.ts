import { Servicios } from './servicios.model';
import { VariablesAuditoria } from './variables-auditoria';

export class SubPrograma extends VariablesAuditoria{
  idSubPrograma?:string;
  descripcion:string;
  servicios?:Servicios[];
  idFront:number;
}