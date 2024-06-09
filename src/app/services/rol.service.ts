import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Http } from '@models/generico/http';
import { RolPemisos } from '@models/rol/rol-data.model';
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
