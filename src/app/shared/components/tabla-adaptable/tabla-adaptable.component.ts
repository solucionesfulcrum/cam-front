import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormatoColumna } from './formato-columna.model';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'esp-tabla-adaptable',
  templateUrl: './tabla-adaptable.component.html',
  styleUrls: ['./tabla-adaptable.component.scss'],
  standalone: true,
  imports:[CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MaterialModule],
})
export class TablaAdaptableComponent {
  @Input()
  identificadorVisible: boolean = true;

  @Input()
  dataColumnas: FormatoColumna[] = []; //------------------------------------------------------------------------ Información de las columnas que, a su vez, contienen los atributos de las filas, estos atributos peuden estar ocultos si se requiere

  @Input()
  dataIngresante = new FormControl(); //------------------------------------------------------------------------ Data que va a ingresarse a la tabla, es mandar un elemento y listarlo en la siguiente fila, las restricciones dependen del developer

  @Output()
  sendData = new EventEmitter<any>(); //------------------------------------------------------------------------ Esta es la puerta por donde saldrá la información y debe ser recepcionada por un formControl

  formData = this.fb.group({
    data: this.fb.array([])
  });

  constructor(private fb                          : FormBuilder){}

  ngOnInit(){
    this.dataIngresante.valueChanges.subscribe((data)=>{
      if (data) {
        let filaForm = this.fb.group({})
        for (let j = 0; j < this.dataColumnas.length; j++) {
          filaForm.addControl(this.dataColumnas[j].nomAttribute, new FormControl((data[this.dataColumnas[j].nomAttribute] !== undefined) ? data[this.dataColumnas[j].nomAttribute] : null));
        }
        (this.formData.controls["data"] as FormArray).push(filaForm);
      }
    })

    this.formData.valueChanges.subscribe((data)=>{
      // console.log(data)
      this.sendData.emit(data)
    })
    this.formData.controls.data.setValue([])
  }

  get getDatos() {
    return this.formData.controls["data"] as FormArray;
  }

  getValueAttribute(keyValue: FormatoColumna, whereSearch: any): any{
    return whereSearch[keyValue.nomAttribute];
  }
  
  getFormGroup(control: AbstractControl) { return control as FormGroup; }

  deleteElement(elementIndex: number) {
    this.getDatos.removeAt(elementIndex);
  }
  
  actualizarDate(index: number, nomAttribute: string, value: any) {
    console.log(index, nomAttribute)
    console.log(this.formData.controls["data"].at(index).value)
    this.formData.controls["data"].at(index).get(nomAttribute)?.setValue(value)
    // if (input == '') {
    //   input = null;
    // }
    // switch (opt) {
    //   case 1:
    //     this.formVigencia.controls.frmInicioVigencia.setValue(input)
    //     break;
    //   case 2:
    //     this.formVigencia.controls.frmFinVigencia.setValue(input)
    //     break;
    // }
  }
}
