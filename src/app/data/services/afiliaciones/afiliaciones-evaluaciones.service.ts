import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { RequestEvaluacionReporte, RequestEvaluacionRespuestas, RequestRegisterAnswersEvaluacion, RequestResultsEvaluacion, SendDataResultado } from '@models/afiliaciones/evaluaciones/evaluacion-evaluar.model';

const URL_BASE = `${environment.API}/evaluacion`;

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesEvaluacionesService {

  formDataTestPfi: any = this.fb.group({});

  formDataTestKatz: any = this.fb.group({});

  formDataTestGij: any = this.fb.group({
    pregFam: new FormControl(null, [Validators.required]),
    pregRel: new FormControl(null, [Validators.required]),
    pregApo: new FormControl(null, [Validators.required])
  });

  formDataTestYesa: any = this.fb.group({});


  constructor(private fb                          : FormBuilder,
              private _httpClient                 : HttpClient) { 
    this.generateForms();
  }

  generateForms(){
    this.structureForms(1, 'pregPfi_', 10);
    this.structureForms(2, 'pregKatz_', 6);
    this.structureForms(3, 'pregYesa_', 15);
  }

  structureForms(id: number, prefijo: string, cantidad: number){
    let filaForm = this.fb.group({})
    for (let i = 0; i < cantidad; i++) {
      filaForm.addControl(prefijo + i, (this.fb.control(null, Validators.required)));
    }
    switch (id) {
      case 1:
        this.formDataTestPfi = filaForm;
        break;
      case 2:
        this.formDataTestKatz = filaForm;        
        break;
      case 3:
        this.formDataTestYesa = filaForm;        
        break;
    }
  }

  getEvaluacionPreguntas(){
    const url = `${URL_BASE}/listar/cuestionarios`;
    return this._httpClient.get<any>(url);
  }

  getRespuestasEvaluacion(model: RequestEvaluacionRespuestas){
    const url = `${URL_BASE}/obtener/cuestionarios-resueltos`;
    return this._httpClient.post<any>(url, model);
  }

  registerEvaluacionRespuesta(model: RequestRegisterAnswersEvaluacion){
    const url = `${URL_BASE}/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  getResultsEvaluacion(model: RequestResultsEvaluacion){
    const url = `${URL_BASE}-resultado/obtener`;
    return this._httpClient.post<any>(url, model);
  }

  registerResultsEvaluacion(model: SendDataResultado){
    const url = `${URL_BASE}-resultado/registrar`;
    return this._httpClient.post<any>(url, model);
  }

  //REPORTES
  getListaEvaluacionesNacional(model: RequestEvaluacionReporte){
    const url = `${environment.API}/evaluacion/listar/nacional`;
    return this._httpClient.post<any>(url, model);
  }

  getExcelEvaluacionesNacional(model: RequestEvaluacionReporte){
    const url = `${environment.API}/report/evaluaciones/excel/lista-evaluaciones-nacional`;
    return this._httpClient.post<any>(url, model);
  }
}
