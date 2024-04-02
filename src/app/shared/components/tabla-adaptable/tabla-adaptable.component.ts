import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormatoColumna, FormatoTypeAndSelect } from './formato-columna.model';
import { MaterialModule } from 'src/app/material/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'esp-tabla-adaptable',
  templateUrl: './tabla-adaptable.component.html',
  styleUrls: ['./tabla-adaptable.component.scss'],
  standalone: true,
  imports:[CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MaterialModule, MatAutocompleteModule],
})
export class TablaAdaptableComponent {
  @Input()
  identificadorVisible: boolean = true;

  @Input()
  dataColumnas: FormatoColumna[] = []; //------------------------------------------------------------------------ Información de las columnas que, a su vez, contienen los atributos de las filas, estos atributos peuden estar ocultos si se requiere

  @Input()
  dataIngresante = new FormControl(); //------------------------------------------------------------------------ Data que va a ingresarse a la tabla, es mandar un elemento y listarlo en la siguiente fila, las restricciones dependen del developer

  @Input()
  dataDefault!: any[]; //------------------------------------------------------------------------ Data de la tabal que va a guardarse por default, requiere que la información ingresada tenga el formato de la data de las columnas anteriormente ingresadas

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
          filaForm.addControl(this.dataColumnas[j].nomAttribute, new FormControl(((data[this.dataColumnas[j].nomAttribute] !== undefined) ? data[this.dataColumnas[j].nomAttribute] : null), (this.dataColumnas[j].obligatorio ? [Validators.required] : null)));
        }
        (this.formData.controls["data"] as FormArray).push(filaForm);
      }
    })

    this.dataIngresante.valueChanges.subscribe((data)=>{
    })
    this.formData.valueChanges.subscribe((data)=>{
      this.sendData.emit(data)
    })
    this.formData.controls.data.setValue([])
    if (this.dataDefault) {
      if (this.dataDefault.length > 0) {
        this.dataDefault.forEach((x: any)=>{
          let filaForm = this.fb.group({})
          for (let j = 0; j < this.dataColumnas.length; j++) {
            filaForm.addControl(this.dataColumnas[j].nomAttribute, new FormControl(x[this.dataColumnas[j].nomAttribute]));
          }
          (this.formData.controls["data"] as FormArray).push(filaForm);
        })
      }
    }
  }

  get getDatos() {
    return this.formData.controls["data"] as FormArray;
  }

  getValueAttribute(keyValue: FormatoColumna, whereSearch: any): any{
    return whereSearch[keyValue.nomAttribute];
  }
  
  getFormGroup(control: AbstractControl) { return control as FormGroup; }

  getFormControl(dataForm: AbstractControl, controlName: string){
    let consultado = this.getFormGroup(dataForm).get(controlName)!;
    if (consultado.touched && consultado.invalid) {
      if (consultado.getError('required')) {
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }

  deleteElement(elementIndex: number) {
    this.getDatos.removeAt(elementIndex);
  }
  
  actualizarDate(index: number, nomAttribute: string, value: any) {
    if (value) {
      this.formData.controls["data"].at(index).get(nomAttribute)?.setValue(value)
    }
  }

  onSelectedTypeSelect(index: number, nomAttribute: string, event: any){
    this.formData.controls["data"].at(index).get(nomAttribute)?.setValue(event.option.value)
  }

  displayOptFiltered(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  getOptionsFiltered(index: number, nomAttribute: string): FormatoTypeAndSelect[]{
    let listTypSelect = this.dataColumnas.find((x) => x.nomAttribute == nomAttribute)!.optTypeSelect;
    return (listTypSelect!.filter((x) => x.nombre.toLowerCase().includes((typeof this.formData.controls["data"].at(index).get(nomAttribute)!.value) === 'string' ? this.formData.controls["data"].at(index).get(nomAttribute)!.value.toLowerCase() : this.formData.controls["data"].at(index).get(nomAttribute)!.value.nombre.toLowerCase())))
  }
}
