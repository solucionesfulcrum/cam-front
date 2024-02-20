import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequestCreateHorario, RequestCreateHorarioAdminis, RequestListHorarios, RequestRegisterAtencion } from '@models/horario/horario.model';

const URL_BASE = `${environment.API}/horario`;
@Injectable({
  providedIn: 'root'
})
export class HorarioAdministracionService {

  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  horarioRegistrado: {idHorario: any, listProfesionales: any[]} = Object();

  unidadesRehabilitacion = [
    {idUnidadRehab: 1, nombre: 'Unidad de Rehabilitación A', profesionales: [
      {idProfesional: 1, profesional: 'Dr. Juan Pérez', horasMes: 80},
      {idProfesional: 2, profesional: 'Dra. Laura Martínez', horasMes: 65}
    ]},
    {idUnidadRehab: 2, nombre: 'Unidad de Rehabilitación B', profesionales: [
      {idProfesional: 3, profesional: 'Dra. Ana Gómez', horasMes: 60},
      {idProfesional: 4, profesional: 'Lic. Carlos López', horasMes: 55},
      {idProfesional: 5, profesional: 'Dr. Andrés González', horasMes: 60}
    ]},
    {idUnidadRehab: 3, nombre: 'Unidad de Rehabilitación C', profesionales: [
      {idProfesional: 6, profesional: 'Lic. María Rodríguez', horasMes: 70},
      {idProfesional: 7, profesional: 'Dr. Andrés González', horasMes: 60},
      {idProfesional: 8, profesional: 'Dra. Patricia Fernández', horasMes: 70},
      {idProfesional: 9, profesional: 'Lic. Gabriela Torres', horasMes: 75}
    ]},
    {idUnidadRehab: 4, nombre: 'Unidad de Rehabilitación D', profesionales: [
      {idProfesional: 10, profesional: 'Dr. Pedro Sánchez', horasMes: 75},
      {idProfesional: 11, profesional: 'Dr. Ricardo Ramírez', horasMes: 80}
    ]}
  ];

  horariosRegistrados = [{anio: "2023", idHorario: 1, mes: '9', listProfesionales: [
    {horasMes: 60, horasVacaciones: 0, idProfesional: 3, nomProfesional: 'Dra. Ana Gómez', regimen: '3', horasProgramadas: 22, actividadesAsignadas: [
      {inicioActividad: new Date('2023-09-01 09:00'), terminaActividad: new Date('2023-09-01 16:00'), actividad: 'Organización y participación en eventos, ferias y actividades de RP'},
      {inicioActividad: new Date('2023-09-04 10:00'), terminaActividad: new Date('2023-09-04 13:00'), actividad: 'Seguimiento de capacitación para el trabajo'},
      {inicioActividad: new Date('2023-09-04 14:00'), terminaActividad: new Date('2023-09-04 15:00'), actividad: 'Elaboración de Informes'},
      {inicioActividad: new Date('2023-09-05 07:00'), terminaActividad: new Date('2023-09-05 09:00'), actividad: 'Seguimiento de capacitación para el trabajo'},
      {inicioActividad: new Date('2023-09-05 13:00'), terminaActividad: new Date('2023-09-05 17:00'), actividad: 'Seguimiento de casos'},
      {inicioActividad: new Date('2023-09-07 07:00'), terminaActividad: new Date('2023-09-07 09:00'), actividad: 'Seguimiento de capacitación para el trabajo'},
      {inicioActividad: new Date('2023-09-07 14:00'), terminaActividad: new Date('2023-09-07 18:00'), actividad: 'Evaluación Social'}
    ]},
    {horasMes: 55, horasVacaciones: 10, idProfesional: 4, nomProfesional: 'Lic. Carlos López', regimen: '2', horasProgramadas: 4, actividadesAsignadas: [
      {inicioActividad: new Date('2023-09-08 08:00'), terminaActividad: new Date('2023-09-08 12:00'), actividad: 'Elaboración de Informes'}
    ]},
    {horasMes: 60, horasVacaciones: 0, idProfesional: 5, nomProfesional: 'Dr. Andrés González', regimen: '1', horasProgramadas: 0, actividadesAsignadas: []},
  ]}];


  constructor(private _httpClient: HttpClient) { }

  getBandejaHorarios(model: RequestListHorarios){
    const url = `${URL_BASE}/listar/bandeja`;
    return this._httpClient.post<any>(url, model);
  }

  getListUnidadesRehab(){
    const url = `${environment.API}/proceso/listar/por-tipo-unidad`;
    return this._httpClient.get<any>(url);
  }
  
  registerHorarioAdministrativo(model: RequestCreateHorarioAdminis){
    const url = `${URL_BASE}/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getDataHorario(idHorario: string){
    const url = `${URL_BASE}/datos?horarioId=${idHorario}&unidOperativaId=${this.idUnidadOperativaUser}`;
    return this._httpClient.get<any>(url);
  }

  getDataResumenProfesional(horarioId: any, profesionalId: any){
    const url = `${URL_BASE}/planificacion/resumen?horarioId=${horarioId}&profesionalId=${profesionalId}`;
    return this._httpClient.get<any>(url);
  }

  getDataPlanificacionProfesional(horarioId: any, profesionalId: any){
    const url = `${URL_BASE}/planificacion?horarioId=${horarioId}&profesionalId=${profesionalId}`;
    return this._httpClient.get<any>(url);
  }

  registerHorario(model: RequestCreateHorario, idHorario: any): any{
    let horario = Object();
    horario.idHorario = idHorario;
    horario.mes = model.mes;
    horario.anio = model.anio;
    model.listPorfesionales.forEach((x) => {x.horasProgramadas = 0; x.actividadesAsignadas = []});
    horario.listProfesionales = model.listPorfesionales;
    this.horariosRegistrados.push(horario)
    return horario;
  }

  registerAsignacionHorario(model: RequestRegisterAtencion){
    let personaBuscada = this.horariosRegistrados.find((x)=>{return x.idHorario == model.idHorario})!.listProfesionales.find((data)=>{return data.idProfesional == model.idProfesional});
    personaBuscada!.actividadesAsignadas.push({inicioActividad: model.horaInicioAsignacion, terminaActividad: model.horaFinAsignacion, actividad: model.actividadRegistrada});
    personaBuscada!.horasProgramadas = personaBuscada!.horasProgramadas + (model.horaFinAsignacion.getHours() - model.horaInicioAsignacion.getHours());
  }
}
