import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ipressData, modalidadIngData, regionData } from '@models/admision/ficha-datos-adicionales.model';
import { Observable, map, startWith } from 'rxjs';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

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
  filteredOptionsModalidad: any[] = [];
  filteredCam!: Observable<any[]>;
  listCAM: any[] = [];
  allowSearchIpress = false;

  public formModIngreso = this.fb.nonNullable.group({
    frmModalidad:['', [Validators.required]],
  });

  constructor(@Inject(DIALOG_DATA) public data: any,
              private fb:FormBuilder,
              private datosGeneralesService: DatosGeneralesService,
              private contactosService: ContactosAfiliadosService,
              private _dialogRef:DialogRef<DialogModalidadIngresoComponent>){

  }
  
  ngOnInit(): void {
    if(this.data.type == 1){
      this.frmCtrlRegion.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.region)).subscribe((data)=>{
        this.contactosService.searchRegion('ESSALUD', data).subscribe((datos)=>{
         this.filteredOptionsRegion = datos.data;
        })
      })
      this.frmCtrlModalidad.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.establecimiento)).subscribe((data)=>{
        if(this.allowSearchIpress){
          this.contactosService.searchDependencias('ESSALUD',data,this.regionSeleccionadaTmp.codigo).subscribe((datos)=>{
            this.listIpress = datos.data;
          })
        }
      })
    }
    else if(this.data.type == 2){
      let unidad = 'CERP';
      this.frmCtrlModalidad.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.nombre)).subscribe((data)=>{
        this.contactosService.searchUnidadOperativa(unidad, data).subscribe((datos)=>{
          this.filteredOptionsModalidad = datos.data;
        })
      })
    }
    else if( this.data.type == 3){
      this.datosGeneralesService.getUnidadesOperativas('').subscribe((data)=>{
        console.log(data)
        this.listCAM = data.data;
      });
      this.filteredCam = this.frmCtrlModalidad.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombreUbicacion),
        map(nombreUbicacion => nombreUbicacion ? this._filterCAM(nombreUbicacion) : this.listCAM.slice()),
      );
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
    this.modalidadSeleccionadaTmp = event.option.value;
    this.formModIngreso.get('frmModalidad')?.setValue(this.modalidadSeleccionadaTmp.nombre);
  }
  
  private _filterCAM(value: string): any[] {
    
    if (value != undefined) {
      const filterValue = value.toLowerCase();
      return this.listCAM.filter(option => option.nombre.toLowerCase().includes(filterValue));
    }
    return this.listCAM
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
      console.log(this.data)
      this._dialogRef.close(this.data);
    }
    else{
      this.formModIngreso.markAllAsTouched();
    }
  }
}
