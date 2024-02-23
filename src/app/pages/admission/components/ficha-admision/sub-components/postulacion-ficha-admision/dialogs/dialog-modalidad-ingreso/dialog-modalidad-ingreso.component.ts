import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ipressData, modalidadIngData, regionData } from '@models/admision/ficha-datos-adicionales.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'esp-dialog-modalidad-ingreso',
  templateUrl: './dialog-modalidad-ingreso.component.html',
  styleUrls: ['./dialog-modalidad-ingreso.component.scss']
})
export class DialogModalidadIngresoComponent {

  
  frmCtrlRegion = new FormControl();
  frmCtrlModalidad = new FormControl();
  regionSeleccionadaTmp!: regionData;
  ipressSeleccionadaTmp!: ipressData;
  modalidadSeleccionadaTmp!: modalidadIngData;
  filteredOptionsRegion!: regionData[];
  listIpress!: ipressData[];
  filteredOptionsModalidad!: modalidadIngData[];
  allowSearchIpress = false;

  public formModIngreso = this.fb.nonNullable.group({
    frmModalidad:['', [Validators.required]],
  });

  constructor(@Inject(DIALOG_DATA) public data: any,
              private fb:FormBuilder,
              private datosGeneralesService: DatosGeneralesService,
              private _dialogRef:DialogRef<DialogModalidadIngresoComponent>){

  }
  
  ngOnInit(): void {
    if(this.data.type == 1){
      this.frmCtrlRegion.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.region)).subscribe((data)=>{
        this.datosGeneralesService.searchRegion('ESSALUD', data).subscribe((datos)=>{
         this.filteredOptionsRegion = datos.data;
        })
      })
      this.frmCtrlModalidad.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.establecimiento)).subscribe((data)=>{
        if(this.allowSearchIpress){
          this.datosGeneralesService.searchDependencias('ESSALUD',data,this.regionSeleccionadaTmp.codigo).subscribe((datos)=>{
            console.log(datos)
            this.listIpress = datos.data;
          })
        }
      })
    }
    else if(this.data.type == 2 || this.data.type == 3){
      let unidad = '';
      if (this.data.type == 2) {
        unidad = 'CERP';
      }
      else{
        unidad = 'MBRP';
      }
      this.frmCtrlModalidad.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.nombre)).subscribe((data)=>{
        this.datosGeneralesService.searchUnidadOperativa(unidad, data).subscribe((datos)=>{
          this.filteredOptionsModalidad = datos.data;
        })
      })
    }
  }
  //    Region    -----------------------------------------------------------------------------
  displayFnRegion(selectedoption: any) {
    return selectedoption ? selectedoption.region : undefined;
  }

  onSelectionChangeRegion(event: any) {
    this.allowSearchIpress = true;
    this.regionSeleccionadaTmp = event.option.value;
    this.frmCtrlModalidad.setValue('')
  }

  //    Ipress    -----------------------------------------------------------------------------
  displayFnIpress(selectedoption: any) {
    return selectedoption ? selectedoption.establecimiento : undefined;
  }

  onSelectionChangeIpress(event: any) {
    console.log(event.option.value)
    this.ipressSeleccionadaTmp = event.option.value;
    this.formModIngreso.get('frmModalidad')?.setValue(this.ipressSeleccionadaTmp.establecimiento);
  }

  //    Modalidad    -----------------------------------------------------------------------------
  displayFnModalidad(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  onSelectionChangeModalidad(event: any) {
    console.log(event.option.value)
    this.modalidadSeleccionadaTmp = event.option.value;
    this.formModIngreso.get('frmModalidad')?.setValue(this.modalidadSeleccionadaTmp.nombre);
  }
  
  onClose(){
    this._dialogRef.close();
  }
  
  onSave(){
    if (this.formModIngreso.valid) {
      this.data.guarda = true;
      this.data.nombre = this.formModIngreso.value.frmModalidad;
      if(this.data.type == 1){
        this.data.modalidadIngreso = this.ipressSeleccionadaTmp;
      }
      else{
        this.data.modalidadIngreso = this.modalidadSeleccionadaTmp;
      }
      this._dialogRef.close(this.data);
    }
    else{
      this.formModIngreso.markAllAsTouched();
    }
  }
}