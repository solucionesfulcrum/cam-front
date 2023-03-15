import { VariablesAuditoria } from './variables-auditoria';
import { Asegurado } from './asegurado';
import { TallerHorariosDet } from './taller-horarios-det';

export class Asistencia extends VariablesAuditoria {
 idAsistencia: number;
 tallerDet: TallerHorariosDet;
 asegurado: Asegurado;
 estadoAsistencia: string;
}
