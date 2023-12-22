import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL_BASE = `${environment.HOST}/contatos`;
@Injectable({
  providedIn: 'root'
})
export class ContactosAfiliadosService {

  constructor(private _httpClient: HttpClient) { }
}
