import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesEvaluacionesService {

  formData = this.fb.group({
    dataTestPfi: this.fb.array([]),
    dataTestKatz: this.fb.array([]),
    dataTestGij1: this.fb.array([]),
    dataTestGij2: this.fb.array([]),
    dataTestGij3: this.fb.array([]),
    dataTestYesa: this.fb.array([]),
  });

  formDataTestPfi = this.fb.group({});

  formDataTestKatz = this.fb.group({});

  formDataTestGij1 = this.fb.group({});

  formDataTestGij2 = this.fb.group({});

  formDataTestGij3 = this.fb.group({});

  formDataTestYesa = this.fb.group({});


  constructor(private fb                          : FormBuilder,) { 
    this.generateForms();
  }

  generateForms(){
    this.structureForms(1, 'pregPfi_', 10);
    this.structureForms(2, 'pregKatz_', 6);
    this.structureForms(3, 'pregYesa_', 15);
    // this.formDataTestPfi.valueChanges.subscribe((data)=>{
    //   console.log(data)
    // })
  }

  structureForms(id: number, prefijo: string, cantidad: number){
    // Generación del primer formulario
    let filaForm = this.fb.group({})
    for (let i = 0; i < cantidad; i++) {
      filaForm.addControl(prefijo + i, new FormControl());
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
}
