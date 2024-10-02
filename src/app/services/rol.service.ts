import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DtGenericoSinPaginar } from '@models/generico/dt-generico';
import { Http } from '@models/generico/http';
import { RolPemisos, RolServicios } from '@models/rol/rol-data.model';
import { Observable, delay, of } from 'rxjs';

const URL_BASE = `${environment.API}/roles`;

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private _httpClient: HttpClient) { }

  getListRoles(){
    const url = `${URL_BASE}/listar`;
    return this._httpClient.get<any>(url);
  }

  getListRolesActivos(){
    const url = `${URL_BASE}/listar/activos`;
    return this._httpClient.get<any>(url);
  }

  getDatosRol(idRol: number){
    const url = `${URL_BASE}/get-datos-rol/${idRol}`;
    return this._httpClient.get<any>(url);
  }

  getServiciosDelRol(idRol: number){
    const url = `${URL_BASE}/get-servicios-rol/${idRol}`;
    return this._httpClient.get<DtGenericoSinPaginar<RolServicios[]>>(url);
  }

  agregarServiciosRol(data : {idServicio: number, idRol: number}[]){
    const url = `${URL_BASE}/agregar-servicios-por-rol`;
    return this._httpClient.post<any>(url, data);
  }

  eliminarServiciosRol(idRolesServicio: number[]){
    const url = `${URL_BASE}/eliminar-servicios-rol`;
    return this._httpClient.post<any>(url, idRolesServicio);
  }


  getPermisosRoles() : Observable<Http<RolPemisos>> {
    const permisos : Http<RolPemisos> ={
      data: [
        {
          descripcion: "ADMINISTRAR DASHBOARD AFILIADOS",
          estado: true,
          children: [{
            descripcion: "CONSULTAR",
            estado: true
          }]
        },
        {
          descripcion: "ADMINISTRAR CONTACTOS - ASEGURADOS",
          estado: true,
          children: [
            {
              descripcion: "CONSULTAR",
              estado: true
            },
            {
              descripcion: "REGISTRAR",
              estado: true
            },
            {
              descripcion: "EDITAR",
              estado: true
            },
            {
              descripcion: "ELIMINAR",
              estado: true
            },
            {
              descripcion: "IMPRIMIR",
              estado: true
            },
        ]
        },
        {
          descripcion: "ADMINISTRAR CONTACTOS - TALLERISTAS",
          estado: false,
        },
        {
          descripcion: "ADMINISTRAR AFILIACIONES - SOLICITUDES",
          estado: false,
          children: [
            {
              descripcion: "CONSULTAR",
              estado: true
            },
            {
              descripcion: "REGISTRAR",
              estado: false
            },
            {
              descripcion: "EDITAR",
              estado: false
            },
            {
              descripcion: "ELIMINAR",
              estado: false
            },
            {
              descripcion: "IMPRIMIR",
              estado: false
            }
          ]
        },
        {
          descripcion: "ADMINISTRAR AFILIACIONES - EVALUACIONES",
          estado: false,
          children: [
            {
              descripcion: "CONSULTAR",
              estado: true
            },
            {
              descripcion: "REGISTRAR",
              estado: true
            },
            {
              descripcion: "EDITAR",
              estado: false
            },
            {
              descripcion: "ELIMINAR",
              estado: false
            },
            {
              descripcion: "IMPRIMIR",
              estado: false
            }
          ]
        },
      ]
    } 

    return of<Http<RolPemisos>>(permisos).pipe(delay(1000));
  }
}
