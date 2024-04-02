import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, FormatoTypeAndSelect, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-contratos-asignar-servicios',
  templateUrl: './contratos-asignar-servicios.component.html',
  styleUrls: ['./contratos-asignar-servicios.component.scss']
})
export class ContratosAsignarServiciosComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Guardar', colorBtn:'mezclado'},
    {texto: 'Guardar y Enviar', colorBtn:'mezclado'},
  ];
  faSpinner = faSpinner;
  numOc: any; 
  dataContrato: any;
  opcionesEvento: TablaOpciones[] = [];
  opcionesServicios: FormatoTypeAndSelect[] = [];
  opcionesModalidad: TablaOpciones[] = [];
  opcionesUnidades: any[] = [];
  
  dataColumnas: FormatoColumna[] = [
    {nomAttribute: 'idServicio', oculto: true},
    {header: 'Servicio', tipo: 'typeAndSelect', optTypeSelect: this.opcionesServicios, nomAttribute: 'nomServicio', resaltado: true, obligatorio: true},
    {header: 'Tipo de Evento', tipo: 'select', opciones: this.opcionesEvento, nomAttribute: 'typeEvent', obligatorio: true},
    {header: 'Fecha de inicio', tipo: 'inputFecha', nomAttribute: 'fecInicio', obligatorio: true},
    {header: 'Fecha de Fin', tipo: 'inputFecha', nomAttribute: 'fecFin', obligatorio: true},
    {header: 'Modalidad', tipo: 'select', opciones: this.opcionesModalidad, nomAttribute: 'typeModalidad', obligatorio: true}
  ];

  dataTables: FormArray = this.fb.array([]);
  
  constructor(private fb                                : FormBuilder, 
              private notificationService               : NotificationService,
              private datosGeneralesService             : DatosGeneralesService,
              private activeRoute                       : ActivatedRoute,
              @Inject(LOCALE_ID) private locale         : string,
              private contratoService                   : ContratosAdministracionService,
              private router                            : Router, 
              private route                             : ActivatedRoute) { 
      this.numOc = this.activeRoute.snapshot.paramMap.get('codOrden')!;
    }

  ngOnInit(){
    this.getDataServices();
  }

  getDataServices(){
    this.contratoService.getListCamById().subscribe((data)=>{
      if (data.code == 0) {
        data.data[0].listarCam.forEach((x: any)=>{
          this.opcionesUnidades.push({idUnidadOperativa: x.idUnidadOperativa, codigo: x.codigoCam, nombre: x.nombreCam})
          if (x.listaCiram.length > 0) {
            x.listaCiram.forEach((val: any)=>{
              this.opcionesUnidades.push({idUnidadOperativa: val.idUnidadOperativa, codigo: val.codigo, nombre: val.nombre})
            })
          }
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })

    this.contratoService.getListServicios().subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((x: any)=>{
          this.opcionesServicios.push({idOpcion: x.idServicio, nombre: x.nombre})
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.datosGeneralesService.getTipoParametros('TIPO_SERVICIO').subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((x)=>{
          this.opcionesEvento.push({idOpcion: x.idParametros, nombre: x.nombre, value: x.idParametros})
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.datosGeneralesService.getTipoParametros('MODALIDAD').subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((x)=>{
          this.opcionesModalidad.push({idOpcion: x.idParametros, nombre: x.nombre, value: x.idParametros})
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.contratoService.getDataFromOC(this.numOc).subscribe((data)=>{
      if (data.code == 0) {
        this.dataContrato = data.data;
        this.addTablaUnid(2,this.dataContrato.datosDetMismaUnidad[0])
        if (this.dataContrato.datosDetOtraUnidad.length > 0) {
          this.dataContrato.datosDetOtraUnidad.forEach((x: any)=>{
            this.addTablaUnid(2, x);
          })
        }
        this.dataTables.valueChanges.subscribe((data)=>{
          console.log(data)
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  goToConfirm(){
    this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}`])
  }

  addTablaUnid(opt: number, dataTabla?: any){
    if (opt == 1) {
      let controlPrueba = this.fb.group({
        idUnidOperativ: new FormControl('', [Validators.required]),
        fecRegistro: new FormControl(null, [Validators.required]),
        fecRegistroDef: new FormControl(null, [Validators.required]),
        dataServiciosEnviado: new FormControl(),
        dataDefault: [null],
        ctrlDataObt: new FormControl(),
      });
      (this.dataTables as FormArray).push(controlPrueba);
    }
    else{
      let dataOrdenada: any[] = [];
      dataTabla.servicios.forEach((val: any)=>{
        dataOrdenada.push(
          {
            idServicio: 1,
            nomServicio: (val.servicio ? {idOpcion: this.opcionesServicios.find((x) => x.nombre === val.servicio)!.idOpcion, nombre: val.servicio} : ''),
            typeEvent: (val.paramServicioTipoId ? val.paramServicioTipoId : null),
            typeModalidad: (val.paramModalidadId ? val.paramModalidadId : null),
            fecInicio: (val.fechaInicio ? formatDate(val.fechaInicio, 'd/M/yyyy', this.locale) : null),
            fecFin: (val.fechaFin ? formatDate(val.fechaFin, 'd/M/yyyy', this.locale) : null)
          }
        )
      })

      let controlPrueba = this.fb.group({
        idUnidOperativ: new FormControl(this.opcionesUnidades.find((x)=> x.idUnidadOperativa == dataTabla.idUnidadOperativa), [Validators.required]),
        fecRegistro: new FormControl(formatDate(dataTabla.fechaRegistroUo, 'd/M/yyyy', this.locale), [Validators.required]),
        fecRegistroDef: new FormControl((new Date(dataTabla.fechaRegistroUo)), [Validators.required]),
        dataServiciosEnviado: new FormControl(),
        dataDefault: [dataOrdenada],
        ctrlDataObt: new FormControl(),
      });
      (this.dataTables as FormArray).push(controlPrueba);
    }
  }
  
  actualizarDate(index: number, value: any) {
    if (value) {
      this.dataTables.at(index).get('fecRegistro')?.setValue(value)
    }
  }
  
  getFormGroup(control: AbstractControl) { return control as FormGroup; }

  displayOptFiltered(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  onSelectedTypeSelect(index: number, event: any){
    this.dataTables.at(index).get('idUnidOperativ')?.setValue(event.option.value)
  }

  getOptionsFiltered(index: number): any[]{
    let listTypSelect = this.opcionesUnidades;
    return (listTypSelect!.filter((x) => x.nombre.toLowerCase().includes((typeof this.dataTables.at(index).get('idUnidOperativ')!.value) === 'string' ? this.dataTables.at(index).get('idUnidOperativ')!.value.toLowerCase() : this.dataTables.at(index).get('idUnidOperativ')!.value.nombre.toLowerCase())))
  }

  addServiceToTablaUnid(index: number, opt?: number){
    this.dataTables.get(index.toString())!.get('dataServiciosEnviado')!.setValue({idServicio: 1, nomServicio: ''})
  }

  getTablaAndAttribute(index: number, attr: string){
    return (this.dataTables.get(index.toString())!.get(attr)! as FormControl)
  }

  getTablaUnid(index: number){
    return (this.dataTables.get(index.toString())!.get('listServices') as FormControl)
  }

  deleteTablaUnid(index: number){
    this.dataTables.removeAt(index);
  }

  sendData(){
    console.log(this.validacionDataTable())
    console.log(this.dataContrato)
    console.log(this.dataTables.value)
  }

  validacionDataTable(): boolean{
    if (this.dataTables.value.length == 0) {
      this.notificationService.warning(`'El contrato debe estar asignado almenos a una unidad operativa'`);
      return false;
    }
    else{
      let data = this.dataTables.value;
      let valueReturned: boolean = false;
      data.forEach((x: any, index: number) => {
        if (typeof x.idUnidOperativ == 'object') {
          if (x.ctrlDataObt.data.length > 0) {
            valueReturned = true;
          }
          else{
            this.notificationService.warning(`La Unidad Operativa N°${index + 1} no tiene ningún servicio asignado`);
            valueReturned = false;
          }
        }
        else{
          this.notificationService.warning(`La Unidad Operativa N°${index + 1} debe ser elegida de las opciones brindadas`);
          valueReturned = false;
        }
      });
      return valueReturned;
    }
  }
}
