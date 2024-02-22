import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesEvaluacionesService {

  formDataTestPfi: any = this.fb.group({});

  formDataTestKatz: any = this.fb.group({});

  formDataTestGij: any = this.fb.group({
    pregFam: new FormControl(null),
    pregRel: new FormControl(null),
    pregApo: new FormControl(null)
  });

  formDataTestYesa: any = this.fb.group({});


  constructor(private fb                          : FormBuilder,) { 
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
