import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CRUDService<T> {
  constructor(
    protected _http: HttpClient,
    @Inject(String) protected url: string
  ) {}

  listar() {
    return this._http.get<T[]>(this.url, {
      reportProgress: true, // this is importante!
    });
  }

  listarPorId(id: number) {
    return this._http.get<T>(`${this.url}/${id}`);
  }

  registrar(t: T) {
    return this._http.post<T>(this.url, t);
  }

  actualizar(t: T, id: number) {
    return this._http.put<T>(`${this.url}/${id}`, t);
  }

  eliminar(id: number) {
    return this._http.delete(`${this.url}/${id}`);
  }
}
