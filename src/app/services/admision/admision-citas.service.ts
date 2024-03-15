import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { generateFirstAttentionRequest, getBandejaCitasRequest } from '@models/admision/citas/datos-persona.model';

const URL_BASE = `${environment.API}/cita`;

@Injectable({
  providedIn: 'root'
})
export class AdmisionCitasService {

  actividadesFinalizadas = [
    {idActividad: 1, idHist: 341, nombreActividad: 'Evaluación de RP y RS', historial: [
      {id: 1, estadoAtencion: 'CREADO', fecha: new Date('2023-11-05 09:30 AM'), horaInicio: null, horaFin: null, duracion: null, profesional: null, numProfesional: null},
      {id: 2, estadoAtencion: 'PROGRAMADO', fecha: new Date('2023-11-09 09:00 AM'), horaInicio: new Date('2023-11-09  08:40 AM'), horaFin: new Date('2023-11-09  09:00 AM'), duracion: null, profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
      {id: 3, estadoAtencion: 'ATENDIDO', fecha: new Date('2023-11-09 09:00 AM'), horaInicio: new Date('2023-11-09  09:00 AM'), horaFin: new Date('2023-11-09  09:20 AM'), duracion: '20 Min', profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
    ]},
    {idActividad: 2, idHist: 341, nombreActividad: 'CIF', historial: [
      {id: 4, estadoAtencion: 'CREADO', fecha: new Date('2023-11-01 09:30 AM'), horaInicio: null, horaFin: null, duracion: null, profesional: null, numProfesional: null},
      {id: 5, estadoAtencion: 'PROGRAMADO', fecha: new Date('2023-11-05 02:00 PM'), horaInicio: new Date('2023-11-05 02:00 PM'), horaFin: new Date('2023-11-05 02:15 PM'), duracion: null, profesional: 'Robert Wilson', numProfesional: '981 236 580'},
      {id: 6, estadoAtencion: 'ATENDIDO', fecha: new Date('2023-11-05 02:05 PM'), horaInicio: new Date('2023-11-05 02:05 PM'), horaFin: new Date('2023-11-05 02:20 PM'), duracion: '15 Min', profesional: 'Robert Wilson', numProfesional: '981 236 580'},
    ]},
  ];
  
  actividadesCitadas = [
    {id: 1, numHistoria: '', actividad: '', estado: '', fecha: '2023-08-18', horaRango: '', profesional: null, numProfesional: null},
    {id: 2, numHistoria: '146202300069', actividad: 'Evaluación de RP y RS', estado: '', fecha: '2023-10-24', horaRango: '10:00 - 11:30 am', profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
    {id: 3, numHistoria: '342', actividad: 'Discusión de caso', estado: '', fecha: '2023-10-18', horaRango: '10:00 - 11:30 am', profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
    {id: 4, numHistoria: '342', actividad: 'Evaluación Ocupacional', estado: '', fecha: '2023-10-24', horaRango: '10:00 - 11:30 am', profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
    {id: 5, numHistoria: '342', actividad: 'CIF', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 6, numHistoria: '342', actividad: 'Evaluación deportiva', estado: '', fecha: '2023-10-25', horaRango: '10:00 - 11:30 am', profesional: 'Tany Maireth Orihuela Alegre', numProfesional: '949 451 724'},
    {id: 7, numHistoria: '342', actividad: 'Actividad física y acondicionamiento post covid-19', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 8, numHistoria: '342', actividad: 'Actividad física y acondicionamiento', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 9, numHistoria: '342', actividad: 'Evaluación de RP y RS', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 10, numHistoria: '342', actividad: 'Programa Camino a la Autodeterminación', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 11, numHistoria: '342', actividad: 'Gestiones para la integracion/inclusion a la escolaridad', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
    {id: 12, numHistoria: '342', actividad: 'Gestiones para la integracion/inclusion a la escolaridad', estado: '', fecha: null, horaRango: null, profesional: null, numProfesional: null},
  ];

  actividadesInfo = [
    {id: 1, nombreActividad: 'Actividad física y acondicionamiento post covid-19', tiempo: 30, tipoTiempo: 'Min', profesionalesAsignados:[
      {idProfesional: 1, nombreProfesional: 'Tany Maireth Orihuela Alegre', cargo: 'Medico Rehabilitador'},
      {idProfesional: 2, nombreProfesional: 'Profesional 2 prueba', cargo: 'Cargo prueba 2'},
      {idProfesional: 3, nombreProfesional: 'Profesional 3 prueba', cargo: 'Cargo prueba 3'},
      {idProfesional: 4, nombreProfesional: 'Profesional 4 prueba', cargo: 'Cargo prueba 4'},
    ]},
    {id: 2, nombreActividad: 'Evaluación de RP y RS', tiempo: 20, tipoTiempo: 'Min', profesionalesAsignados:[
      {idProfesional: 5, nombreProfesional: 'John Doe', cargo: 'Terapeuta Físico'},
      {idProfesional: 6, nombreProfesional: 'Jane Smith', cargo: 'Terapeuta Ocupacional'},
      {idProfesional: 8, nombreProfesional: 'Emily Davis', cargo: 'Terapeuta Respiratorio'},
    ]},
    {id: 3, nombreActividad: 'Programa Camino a la Autodeterminación', tiempo: 12, tipoTiempo: 'Min', profesionalesAsignados:[
      {idProfesional: 8, nombreProfesional: 'Emily Davis', cargo: 'Terapeuta Respiratorio'},
      {idProfesional: 9, nombreProfesional: 'Robert Wilson', cargo: 'Terapeuta de Rehabilitación'},
      {idProfesional: 12, nombreProfesional: 'Sophia Martinez', cargo: 'Terapeuta Ocupacional'},
      {idProfesional: 13, nombreProfesional: 'Daniel Thomas', cargo: 'Terapeuta Físico'}
    ]},
    {id: 4, nombreActividad: 'Evaluación Ocupacional', tiempo: 1, tipoTiempo: 'Hora', profesionalesAsignados:[
      {idProfesional: 12, nombreProfesional: 'Sophia Martinez', cargo: 'Terapeuta Ocupacional'},
      {idProfesional: 13, nombreProfesional: 'Daniel Thomas', cargo: 'Terapeuta Físico'},
      {idProfesional: 6, nombreProfesional: 'Jane Smith', cargo: 'Terapeuta Ocupacional'},
      {idProfesional: 7, nombreProfesional: 'Michael Johnson', cargo: 'Terapeuta del Habla'}
    ]},
    {id: 5, nombreActividad: 'CIF', tiempo: 15, tipoTiempo: 'Min', profesionalesAsignados:[
      {idProfesional: 8, nombreProfesional: 'Emily Davis', cargo: 'Terapeuta Respiratorio'},
      {idProfesional: 9, nombreProfesional: 'Robert Wilson', cargo: 'Terapeuta de Rehabilitación'},
      {idProfesional: 10, nombreProfesional: 'Olivia Taylor', cargo: 'Terapeuta Acuático'},
      {idProfesional: 11, nombreProfesional: 'David Anderson', cargo: 'Terapeuta de Movimiento'},
      {idProfesional: 12, nombreProfesional: 'Sophia Martinez', cargo: 'Terapeuta Ocupacional'}
    ]},
    {id: 6, nombreActividad: 'Gestiones para la integracion/inclusion a la escolaridad', tiempo: 20, tipoTiempo: 'Min', profesionalesAsignados:[
      {idProfesional: 12, nombreProfesional: 'Sophia Martinez', cargo: 'Terapeuta Ocupacional'},
      {idProfesional: 13, nombreProfesional: 'Daniel Thomas', cargo: 'Terapeuta Físico'},
      {idProfesional: 14, nombreProfesional: 'Ava Garcia', cargo: 'Terapeuta del Habla'}
    ]},
  ];

  citasProgramadas = [
    {idProfesional: 8, idActividadAsignada: 5, horarioAsignado: new Date('2023-11-09 09:00 AM')},
    {idProfesional: 10, idActividadAsignada: 5, horarioAsignado: new Date('2023-11-08 09:15 AM')},
    {idProfesional: 5, idActividadAsignada: 2, horarioAsignado: new Date('2023-11-10 02:00 PM')},
    {idProfesional: 12, idActividadAsignada: 3, horarioAsignado: new Date('2023-11-07 11:00 AM')},
    {idProfesional: 14, idActividadAsignada: 6, horarioAsignado: new Date('2023-11-09 12:00 PM')},
    {idProfesional: 5, idActividadAsignada: 2, horarioAsignado: new Date('2023-11-07 02:20 PM')},
    {idProfesional: 12, idActividadAsignada: 3, horarioAsignado: new Date('2023-11-06 11:00 AM')},
    {idProfesional: 14, idActividadAsignada: 6, horarioAsignado: new Date('2023-11-10 12:00 PM')},
  ];

  constructor(private _httpClient: HttpClient) { }

  generarPrimeraCita(model: generateFirstAttentionRequest){
    const url = `${URL_BASE}/create/inicial`;
    return this._httpClient.post<any>(url, model);
  }

  listarCitasBandeja(model: getBandejaCitasRequest){
    const url = `${URL_BASE}/listar/bandeja`;
    return this._httpClient.post<any>(url, model);
  }

  getCitasOfFicha(idFicha: string){
    const url = `${URL_BASE}/listar/por-ficha/${idFicha}`;
    return this._httpClient.get<any>(url);
  }

  getActividadesProgramar(){
    return this.actividadesInfo;
  }

  getHistorialActividadesFicha( idFicha: number){
    return this.actividadesFinalizadas.filter((x)=> {return x.idHist == idFicha});
  }

  getConsultaAsignacionesPersona(fechaBuscar: Date, idProfesional: number, idActividad: number){
    let valorDevuelto = 0;
    let filtrado = [];
    filtrado = this.citasProgramadas.filter((x)=>{return x.idProfesional == idProfesional && x.idActividadAsignada == idActividad});
    if (filtrado.length != 0) {
      if (filtrado.some(item => (new Date(item.horarioAsignado)).setMinutes(0,0) == fechaBuscar.getTime())) {
        valorDevuelto = 2;
      }
    }
    return valorDevuelto;
  }

  guardarCitaAsignacion(fechaSolicitada: Date, idProfesional: number, idActividad: number){
    this.citasProgramadas.push({idProfesional: idProfesional, idActividadAsignada: idActividad, horarioAsignado: fechaSolicitada});
  }

  getAsignacionesEnHora(fechaBuscar: Date, idProfesional: number, idActividad: number){
    let filtrado = [];
    filtrado = this.citasProgramadas.filter((x)=>{return x.idProfesional == idProfesional && x.idActividadAsignada == idActividad});

    filtrado = filtrado.filter((x)=>{return (new Date(x.horarioAsignado)).setMinutes(0,0) == fechaBuscar.getTime()})

    return filtrado;
  }
}
