import { VariablesAuditoria } from './variables-auditoria';
import { UnidadOperativa } from './unidad-operativa';

export class RelacionesCriram extends VariablesAuditoria {
  idRelacionCiramCam: number;
  unidadOpePadre: UnidadOperativa;
  unidadOpeHijo: UnidadOperativa;
  estado: string;
}
