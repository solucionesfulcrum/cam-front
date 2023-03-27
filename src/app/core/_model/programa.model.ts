import { VariablesAuditoria } from './variables-auditoria';

export class Programa extends VariablesAuditoria{
  idAsignatura:number;
  codAsignatura:string;
  descAsignatura:string;
  nivel:number;
  idPrograma: Programa;
  idSubPrograma:Programa;
}