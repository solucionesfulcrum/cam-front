import { VariablesAuditoria } from './variables-auditoria';
import { Perfiles } from './perfiles';

export class PrivilegiosPorPerfil extends VariablesAuditoria{
  idPrivilegios: number;
  perfil: Perfiles;
  privilegiosDesc: string;
  estado: string;
}
