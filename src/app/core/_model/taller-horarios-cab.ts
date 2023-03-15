import { VariablesAuditoria } from './variables-auditoria';
import { Persona } from './persona';
import { UnidadOperativa } from './unidad-operativa';
import { Talleres } from './talleres';

export class TallerHorariosCab extends VariablesAuditoria {
  idTallerHorarioCab: number;
  taller: Talleres;
  unidadOperativa: UnidadOperativa;
  persona: Persona;
  fecInicio: string;
  fecFin: string;
  modalidad: string;
  estado: string;
}
