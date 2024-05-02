import { Dialog } from '@angular/cdk/dialog';
import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ContratoDetalle, ContratoSubDetalle, RequestContratoDetalle } from '@models/contratos/contratos-administracion.model';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, FormatoTypeAndSelect, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DialogConfirmSelectionComponent } from '../dialog/dialog-confirm-selection/dialog-confirm-selection.component';
import { DialogNewContratoComponent } from '../dialog/dialog-new-contrato/dialog-new-contrato.component';

@Component({
  selector: 'esp-contratos-asignar-servicios',
  templateUrl: './contratos-asignar-servicios.component.html',
  styleUrls: ['./contratos-asignar-servicios.component.scss']
})
export class ContratosAsignarServiciosComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Guardar', colorBtn:'mezclado', loading: false},
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
    {header: 'Fecha de Fin', tipo: 'inputFecha', nomAttribute: 'fecFin', obligatorio: true, ancladoFecIni: 'fecInicio'},
    {header: 'Modalidad', tipo: 'select', opciones: this.opcionesModalidad, nomAttribute: 'typeModalidad', obligatorio: true}
  ];

  dataTables: FormArray = this.fb.array([]);
  
  constructor(private fb                                : FormBuilder, 
              private notificationService               : NotificationService,
              private datosGeneralesService             : DatosGeneralesService,
              private activeRoute                       : ActivatedRoute,
              private dialog                            : Dialog,
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
        this.contratoService.getDataFromOC(this.numOc).subscribe((data)=>{
          if (data.code == 0) {
            this.dataContrato = data.data;
            console.log(this.dataContrato)
            this.addTablaUnid(2,this.dataContrato.datosDetMismaUnidad[0], 0)
            if (this.dataContrato.datosDetOtraUnidad.length > 0) {
              this.dataContrato.datosDetOtraUnidad.forEach((x: any)=>{
                this.addTablaUnid(2, x);
              })
            }
          }
          else{
            this.notificationService.warning(data.message);
          }
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
  }

  addTablaUnid(opt: number, dataTabla?: any, type?: number){
    if (opt == 1) {
      let controlPrueba = this.fb.group({
        idUnidOperativ: new FormControl('', [Validators.required]),
        fecRegistro: new FormControl(formatDate(new Date(), 'd/M/yyyy', this.locale), [Validators.required]),
        fecRegistroDef: new FormControl(new Date(), [Validators.required]),
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

      let dataFecha: any;
      if (type == 0) {
        dataFecha = this.dataContrato.datosTallerista.fechaRegistro;
      }
      else{
        dataFecha = dataTabla.fechaRegistroUo;
      }
      let controlPrueba = this.fb.group({
        idUnidOperativ: new FormControl(this.opcionesUnidades.find((x)=> x.idUnidadOperativa == dataTabla.idUnidadOperativa), [Validators.required]),
        fecRegistro: new FormControl(formatDate(dataFecha, 'd/M/yyyy', this.locale), [Validators.required]),
        fecRegistroDef: new FormControl((new Date(type == 0 ? dataFecha : dataFecha.replace(/-/g, '\/'))), [Validators.required]),
        dataServiciosEnviado: new FormControl(),
        dataDefault: [dataOrdenada],
        ctrlDataObt: new FormControl(),
      });
      (this.dataTables as FormArray).push(controlPrueba);
      // this.dataTables.valueChanges.subscribe((data)=>{console.log(data)})
    }
  }

  editCabeceraCOntrato(){
    const dialogRef = this.dialog.open(DialogNewContratoComponent,{
      minWidth:'800px',
      maxWidth:'50%',
      data:{
        dataTallerista: this.dataContrato.datosTallerista,
        dataContrato: this.dataContrato.datosContrato,
        type: 2
      }
    })
    dialogRef.closed.subscribe(result => {
      if (result == 1) {
        this.contratoService.getDataFromOC(this.numOc).subscribe((data)=>{
          if (data.code == 0) {
            this.dataContrato.datosContrato.fechaInicio = data.data.datosContrato.fechaInicio;
            this.dataContrato.datosContrato.fechaFin = data.data.datosContrato.fechaFin;
            this.dataContrato.datosContrato.nroEntregables = data.data.datosContrato.nroEntregables;
          }
          else{
            this.notificationService.warning(data.message);
          }
        })
      }
    });
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
    let excluded: any[] = [];
    this.dataTables.value.filter((x: any)=> typeof x.idUnidOperativ === 'object').forEach((data: any)=> excluded.push(data.idUnidOperativ));
    listTypSelect = listTypSelect.filter((data)=> !excluded.some((x)=> x.idUnidadOperativa == data.idUnidadOperativa));
    return (listTypSelect!.filter((x) => x.nombre.toLowerCase().includes((typeof this.dataTables.at(index).get('idUnidOperativ')!.value) === 'string' ? this.dataTables.at(index).get('idUnidOperativ')!.value.toLowerCase() : this.dataTables.at(index).get('idUnidOperativ')!.value.nombre.toLowerCase())))
  }

  addServiceToTablaUnid(index: number){
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

  optFunc(opt: number){
    switch (opt) {
      case 1:
        this.router.navigate(['app/contratos'])
        break;
      case 2:
        if (this.validacionDataTable()) {
          this.opcionesBotones[1].loading = true;
          this.contratoService.saveDataDetalleContrato(this.getPayloadAsignacion()).subscribe((data)=>{
            if (data.code == 0) {
              this.opcionesBotones[1].loading = false;
              this.notificationService.success('¡Se guardaron los datos del contrato!');
            }
            else{
              this.opcionesBotones[1].loading = false;
              this.notificationService.warning(data.message);
            }
          })
        }
        break;
      case 3:
        if (this.validacionDataTable()) {
          const dialogRef = this.dialog.open(DialogConfirmSelectionComponent,{
            data:{
              title: '¿Está seguro de confirmar el contrato?',
              message: `De confirmarse, no se podrá volver a editar`,
              type: 1,
              dataRequired: this.getPayloadAsignacion()
            }
          })
      
          dialogRef.closed.subscribe(result => {
            if (result == 1) {
              this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}/${this.numOc}`]);
            }
          });
        }        
        break;
    }
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
            let listComprob = [];
            x.ctrlDataObt.data.forEach((serv: any)=>{
              if (!serv.fecFin || !serv.fecInicio || !serv.typeEvent || !serv.typeModalidad || !serv.nomServicio || typeof serv.nomServicio != 'object') {
                listComprob.push(false);
              }
            })
            if (listComprob.length > 0) {
              this.notificationService.warning(`La tabla N°${index + 1} contiene campos incompletos`);
              valueReturned = false;
            }
            else{
              valueReturned = true;
            }
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

  getPayloadAsignacion(): RequestContratoDetalle{
    let listDataSend = this.dataTables.value;

    let listUnidOper: ContratoDetalle[] = [];
    let firstUnit: ContratoDetalle = Object();
    let firstServ: ContratoSubDetalle [] = [];
    let firstUO = listDataSend.find((x: any)=> x.idUnidOperativ.idUnidadOperativa == this.dataContrato.datosDetMismaUnidad[0].idUnidadOperativa);
    firstUnit.idUnidadOperativa = firstUO.idUnidOperativ.idUnidadOperativa;
    firstUnit.tipoOrigenUnidad = 'MISMA_UNIDAD';
    firstUnit.fechaRegistroUo = formatDate(`${firstUO.fecRegistro.split('/')[2]}-${firstUO.fecRegistro.split('/')[1]}-${firstUO.fecRegistro.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
    firstUO.ctrlDataObt.data.forEach((x: any)=>{
      let fecIn = formatDate(`${x.fecInicio.split('/')[2]}-${x.fecInicio.split('/')[1]}-${x.fecInicio.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
      let fecFn = formatDate(`${x.fecFin.split('/')[2]}-${x.fecFin.split('/')[1]}-${x.fecFin.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
      firstServ.push({idServicio: x.nomServicio.idOpcion, paramServicioTipoId: (typeof x.typeEvent == 'string' ? parseInt(x.typeEvent) : x.typeEvent), fechaInicio: fecIn, fechaFin: fecFn, paramModalidadId: (typeof x.typeModalidad == 'string' ? parseInt(x.typeModalidad) : x.typeModalidad)})
    })
    firstUnit.subDetalle = firstServ;
    listUnidOper.push(firstUnit);

    listDataSend.forEach((uo: any, ix: number)=>{
      if (ix != 0) {
        let unitOtra: ContratoDetalle = Object();
        let unitServ: ContratoSubDetalle [] = [];
        unitOtra.idUnidadOperativa = uo.idUnidOperativ.idUnidadOperativa;
        unitOtra.tipoOrigenUnidad = 'OTRA_UNIDAD';
        unitOtra.fechaRegistroUo = formatDate(`${uo.fecRegistro.split('/')[2]}-${uo.fecRegistro.split('/')[1]}-${uo.fecRegistro.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
        uo.ctrlDataObt.data.forEach((x: any)=>{
          let fecIn = formatDate(`${x.fecInicio.split('/')[2]}-${x.fecInicio.split('/')[1]}-${x.fecInicio.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
          let fecFn = formatDate(`${x.fecFin.split('/')[2]}-${x.fecFin.split('/')[1]}-${x.fecFin.split('/')[0]}`, 'yyyy-MM-dd', this.locale);
          unitServ.push({idServicio: x.nomServicio.idOpcion, paramServicioTipoId: (typeof x.typeEvent == 'string' ? parseInt(x.typeEvent) : x.typeEvent), fechaInicio: fecIn, fechaFin: fecFn, paramModalidadId: (typeof x.typeModalidad == 'string' ? parseInt(x.typeModalidad) : x.typeModalidad)})
        })
        unitOtra.subDetalle = unitServ;

        listUnidOper.push(unitOtra);
      }
    })
    return {
      numOc: this.dataContrato.datosContrato.nroContrato,
      detalle: listUnidOper
    }
  }
}
