import { Role, iUser } from "src/app/interfaces/user.interface";

export class User {
  role: string;
  email: string;
  fullName: string;
  documentType: '1' | '2' | '3';
  dni: string;
  avatar?: string;
  constructor(data?:iUser) {
    this.fullName = data?.nombres || "";
    this.email = data?.email || "";
    this.documentType = data?.tipoDoc || "1";
    this.dni = data?.numDoc || "";
    this.role = data?.roles[0]?.nombre || "";
  }
}
