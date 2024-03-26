import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
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
  
  dataColumnas: FormatoColumna[] = [
    {nomAttribute: 'idServicio', oculto: true},
    {header: 'Servicio', tipo: 'typeAndSelect', optTypeSelect: this.opcionesServicios, nomAttribute: 'nomServicio', resaltado: true},
    {header: 'Tipo de Evento', tipo: 'select', opciones: this.opcionesEvento, nomAttribute: 'typeEvent'},
    {header: 'Fecha de inicio', tipo: 'inputFecha', nomAttribute: 'fecInicio'},
    {header: 'Fecha de Fin', tipo: 'inputFecha', nomAttribute: 'fecFin'},
    {header: 'Modalidad', tipo: 'select', opciones: this.opcionesModalidad, nomAttribute: 'typeModalidad'}
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
        // this.dataTables.push(this.fb.group({idUnidOperativ: [this.dataContrato.datosDetMismaUnidad[0].idUnidadOperativa], fecRegistro: [formatDate(this.dataContrato.datosTallerista.fechaRegistro, 'd/M/yyyy', this.locale)], dataServiciosEnviado: new FormControl(), ctrlDataObt: new FormControl({data: [{
        //     idServicio: 1,
        //     nomServicio: {idOpcion: 12, nombre: "ACTIVIDAD DEPORTIVAS"},
        //     typeEvent: 27,
        //     typeModalidad: 31,
        //     fecInicio: "25/3/2024",
        //     fecFin: "25/3/2024"
        //   }]})})
        // )
        this.dataTables.valueChanges.subscribe((data)=>{
          console.log(data);
        })
        if(this.dataContrato.datosDetMismaUnidad[0].servicios.length > 0){
          this.dataContrato.datosDetMismaUnidad[0].servicios.forEach((x: any)=>{
            this.addServiceToTablaUnid(0, 2, x)
          })
        }
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

  goToConfirm(){
    this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}`])
  }

  addTablaUnid(opt: number, dataTabla?: any){
    if (opt == 1) {
      let controlPrueba = this.fb.group({
        idUnidOperativ: [null],
        fecRegistro: [null],
        dataServiciosEnviado: new FormControl(),
        ctrlDataObt: new FormControl(),
      });
      (this.dataTables as FormArray).push(controlPrueba);
    }
    else{
      console.log(dataTabla)
      let controlPrueba = this.fb.group({
        idUnidOperativ: [dataTabla.idUnidadOperativa],
        fecRegistro: [formatDate(dataTabla.fechaRegistroUo, 'd/M/yyyy', this.locale)],
        dataServiciosEnviado: new FormControl(),
        ctrlDataObt: new FormControl(),
      });
      (this.dataTables as FormArray).push(controlPrueba);
      console.log(document.getElementById('prueba'))
      this.addServiceToTablaUnid(0, 1)
    }
  }

  addServiceToTablaUnid(index: number, opt?: number, dataService?: any){
    this.dataTables.get(index.toString())!.get('dataServiciosEnviado')!.setValue({idServicio: 1, nomServicio: ''})
    console.log(this.dataTables.get(index.toString())!.get('dataServiciosEnviado')!.value)
    // console.log(index, opt)
    if (opt == 1) {
    }
    else{
      // this.dataTables.get(index.toString())!.get('dataServiciosEnviado')!.setValue({
      //   idServicio: 1,
      //   nomServicio: (dataService.servicio ? {idOpcion: this.opcionesServicios.find((x) => x.nombre === dataService.servicio)!.idOpcion, nombre: dataService.servicio} : ''),
      //   typeEvent: (dataService.paramServicioTipoId ? dataService.paramServicioTipoId : null),
      //   typeModalidad: (dataService.paramModalidadId ? dataService.paramModalidadId : null),
      //   fecInicio: (dataService.fechaInicio ? formatDate(dataService.fechaInicio, 'd/M/yyyy', this.locale) : null),
      //   fecFin: (dataService.fechaFin ? formatDate(dataService.fechaFin, 'd/M/yyyy', this.locale) : null)
      // })
    }
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
}
