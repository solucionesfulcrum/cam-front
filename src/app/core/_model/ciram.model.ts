import { VariablesAuditoria } from './variables-auditoria';
import { Red } from './red.model';
import { UbiGeo } from './ubigeo.model';
import { Cam } from './cam.model';

export class Ciram extends VariablesAuditoria{
  idCiram? : number;
  codigo :string;
  descripcion : string;
  tipo:string;
  celular :string;
  email:string;
  fechaInscripcion?:string;
  direccion:string;
  cam:Cam;
  ubigeo:UbiGeo;
  estado:number;

}
