import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtencionCitasService {
  
  estadoBandeja = false;
  
  citasPendientes = [
    {id: 1, nombreActividad: 'Evaluación de RP y RS', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 08:00 AM'), horaInicio: new Date('2023-11-30  08:40 AM'), horaFin: new Date('2023-11-30  09:00 AM'), persona: 'Kevin Emilio Calderon Arellano', numPersona: '949 451 724'},
    {id: 2, nombreActividad: 'Evaluación deportiva', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 09:00 AM'), horaInicio: new Date('2023-11-30  09:00 AM'), horaFin: new Date('2023-11-30  09:20 AM'), persona: 'Diego Alberto Paz Medina', numPersona: '949 451 724'},
    {id: 3, nombreActividad: 'Actividad física y acondicionamiento post covid-19', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 09:00 AM'), horaInicio: new Date('2023-11-30  12:00 PM'), horaFin: new Date('2023-11-30  12:45 PM'), persona: 'Santos Avid Silva Huaman', numPersona: '949 451 724'},
    {id: 4, nombreActividad: 'Discusión de caso', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 09:00 AM'), horaInicio: new Date('2023-11-30  09:30 AM'), horaFin: new Date('2023-11-30  09:45 AM'), persona: 'Jose Silva Lingan', numPersona: '949 451 724'},
    {id: 5, nombreActividad: 'Discusión de caso', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 09:00 AM'), horaInicio: new Date('2023-11-30  04:00 PM'), horaFin: new Date('2023-11-30  04:20 PM'), persona: 'Jose Silva Lingan', numPersona: '949 451 724'},
    {id: 6, nombreActividad: 'Evaluación Ocupacional', estadoAtencion: 'PENDIENTE', fecha: new Date('2023-11-29 09:00 AM'), horaInicio: new Date('2023-12-01  01:00 PM'), horaFin: new Date('2023-12-01  01:55 PM'), persona: 'Pedro Eduardo Tineo Peña', numPersona: '949 451 724'},
  ]

  constructor() { }

  getCitasDia(dateElegido: Date){
    return this.citasPendientes.filter((x)=> x.horaInicio.toLocaleDateString() === dateElegido.toLocaleDateString())
  }
}
