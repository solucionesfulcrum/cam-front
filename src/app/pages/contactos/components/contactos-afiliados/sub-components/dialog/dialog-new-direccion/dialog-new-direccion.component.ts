import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ubicacionGeo } from '@models/admision/ficha-admision.model';
import { direccionFichaFront } from '@models/afiliados/ficha-solicitud.model';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';
import { Observable, map, startWith } from 'rxjs';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-dialog-new-direccion',
  templateUrl: './dialog-new-direccion.component.html',
  styleUrls: ['./dialog-new-direccion.component.scss']
})
export class DialogNewDireccionComponent {

  listUbicaciones: ubicacionGeo[] = [];

  listaDirecciones: Parametro[] = [];

  filteredOptions!: Observable<ubicacionGeo[]>;
  ubicacionSeleccionadaTmp!: ubicacionGeo;
  
  opcionesDireccion = [{id:1, valor:'Casa', selected:false},
                      {id:2, valor:'Trabajo', selected:false},
                      {id:3, valor:'Otros', selected:false},];

  public formDireccion = this.fb.nonNullable.group({
    frmNombreDireccion:['', [Validators.required]],
    frmDireccion:['', [Validators.required]],
    frmPiso:[''],
  });
  distrControl = new FormControl();
  showErrorSelect = false;
  
  constructor(@Inject(DIALOG_DATA) public data: any,
              private fb:FormBuilder,
              private datosService: DatosGeneralesService,
              private _dialogRef:DialogRef<DialogNewDireccionComponent>,) {

  }

  ngOnInit(): void {
    this.getTiposDireccion();
    if (this.data.edicion) {
      // //console.log(this.data.dataForm)
      this.formDireccion.setValue({frmNombreDireccion:this.data.dataForm.nomParametro,frmDireccion: this.data.dataForm.direccion,frmPiso: this.data.dataForm.pisoNumDep})
      this.distrControl.setValue({nombreUbicacion: this.data.dataForm.nomDist + ' - ' + this.data.dataForm.nomProv + ' - ' + this.data.dataForm.nomDep});
      this.ubicacionSeleccionadaTmp = {
        codUbiDep: this.data.dataForm.codDep,
        codUbiProv: this.data.dataForm.codProv,
        codUbiDistr: this.data.dataForm.codDist,
        codUbigeo: this.data.dataForm.codDep,
        nombreUbicacion: this.distrControl.value.nombreUbicacion,
      };
    }
    this.getUbicaciones();
    this.distrControl.valueChanges.subscribe(()=> this.showErrorSelect = false );
    this.filteredOptions = this.distrControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombreUbicacion),
      map(nombreUbicacion => nombreUbicacion ? this._filter(nombreUbicacion) : this.listUbicaciones.slice())
    );
    this.distrControl.addValidators([Validators.required])
  }

  private _filter(value: string): ubicacionGeo[] {
    
    if (value != undefined) {
      const filterValue = value.toLowerCase();
      return this.listUbicaciones.filter(option => option.nombreUbicacion.toLowerCase().includes(filterValue));
    }
    return this.listUbicaciones
  }

  displayFnUbicacion(selectedoption: any) {
    return selectedoption ? selectedoption.nombreUbicacion : undefined;
  }

  onSelectionChangeJefe(event: any) {
    this.ubicacionSeleccionadaTmp = event.option.value;
  }

  async getUbicaciones(){
    await this.datosService.getDepartamentosReniec().subscribe((data)=>{
      data.data.forEach((element: any) => {
        this.datosService.getProvinciasReniec(element.codUbigeo).subscribe((data)=>{
          data.data.forEach((prov: any)=>{
            this.datosService.getDistritosReniec(prov.codUbigeo).subscribe((dataDist)=>{
              dataDist.data.forEach((distr: any)=>{
                let direcciones = distr.codUbigeo.match(/.{1,2}/g);
                this.listUbicaciones.push({nombreUbicacion: distr.descUbigeo + ' - '+ prov.descUbigeo + ' - '+ element.descUbigeo,codUbigeo: distr.codUbigeo,codUbiDep: direcciones[0],codUbiProv: direcciones[1],codUbiDistr: direcciones[2]})
              })
            })
          })
        })
      });
    })
  }
  getTiposDireccion(){
    this.datosService.getTipoParametros('TIPO_DIRECCION').subscribe((data)=>{
      this.listaDirecciones = data.data;
    })
  }
  onClose(){
    this._dialogRef.close();
  }
  onSave(){
    this.showErrorSelect = false;
    if (this.formDireccion.valid && this.distrControl.valid){
      if(this.ubicacionSeleccionadaTmp == undefined){
        this.showErrorSelect = true;
      }
      else{
        this.data.estadoEnvio = 1;
        this.data.datos = this.getDireccion();
        this._dialogRef.close(this.data);
      }
    }
    else{
      this.formDireccion.markAllAsTouched();
      this.distrControl.markAllAsTouched();
    }
    this.formDireccion.markAllAsTouched();
  }

  getDireccion(): direccionFichaFront{
    return {
      paramTipoId: this.listaDirecciones.find((x)=> x.nombre === this.formDireccion.value.frmNombreDireccion!.toUpperCase())!.idParametros,
      nomParametro: this.formDireccion.value.frmNombreDireccion!.toUpperCase(),
      direccion: this.formDireccion.value.frmDireccion!,
      pisoNumDep: this.formDireccion.value.frmPiso!,
      codDep: this.ubicacionSeleccionadaTmp.codUbiDep,
      codProv: this.ubicacionSeleccionadaTmp.codUbiProv,
      codDist: this.ubicacionSeleccionadaTmp.codUbiDistr,
      nomDep: this.ubicacionSeleccionadaTmp.nombreUbicacion.split(' - ')[2],
      nomProv: this.ubicacionSeleccionadaTmp.nombreUbicacion.split(' - ')[1],
      nomDist: this.ubicacionSeleccionadaTmp.nombreUbicacion.split(' - ')[0],
      activo: 0
    }
  }

  onEliminate(){
    this.data.estadoEnvio = 2;
    this.data.reiniciarForm = false;
    if(this.data.dataForm.activo == 1){
      this.data.reiniciarForm = true;
    }
    this._dialogRef.close(this.data);
  }
}
