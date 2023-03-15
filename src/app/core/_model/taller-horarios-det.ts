import { VariablesAuditoria } from './variables-auditoria';
import { TallerHorariosCab } from './taller-horarios-cab';

export class TallerHorariosDet extends VariablesAuditoria {
  idTallerDet: number;
  tallerHorarioCab: TallerHorariosCab;
  dia: string;
  horaIni: string;
  horaFin: string;
  estado: string;
}
