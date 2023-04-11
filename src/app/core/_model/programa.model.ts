import { SubPrograma } from './sub-programa.model';
import { VariablesAuditoria } from './variables-auditoria';

export class Programa extends VariablesAuditoria{

  idPrograma?:string;
  descripcion:string;
  subProgramas?: SubPrograma[];
  cant_servicios= 0

  //para IRME PRESO 
  //idAsignatura?:string;
  //codAsignatura?:string;
  //descasignatura?:string;

}