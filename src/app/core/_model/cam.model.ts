import { VariablesAuditoria } from './variables-auditoria';
import { Red } from './red.model';
import { UbiGeo } from './ubigeo.model';

export class Cam extends VariablesAuditoria{
  idCam?: number;
  fechaInscripcion:string;
  estado: string;
  email:string;
  direccion:string;
  descripcion:string;
  codigo:string;
  celular:string;
  red:Red;
  tipo:string;
  ubigeo:UbiGeo
}