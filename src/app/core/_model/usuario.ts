import { VariablesAuditoria } from './variables-auditoria';
import { Persona } from './persona';
import { Perfiles } from './perfiles';

export class Usuario extends VariablesAuditoria{
  idUsuario: number;
  perfil: Perfiles;
  persona: Persona;
  usuario: string;
  contraseña: string;
}
