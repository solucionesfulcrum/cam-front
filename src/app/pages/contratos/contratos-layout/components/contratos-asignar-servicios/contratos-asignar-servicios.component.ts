import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
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

  opcionesEvento: TablaOpciones[] = [];
  opcionesModalidad: TablaOpciones[] = [];
  
  dataColumnas: FormatoColumna[] = [
    {nomAttribute: 'idServicio', oculto: true},
    {header: 'Servicio', tipo: 'inputText', nomAttribute: 'nomServicio', resaltado: true},
    {header: 'Tipo de Evento', tipo: 'select', opciones: this.opcionesEvento, nomAttribute: 'typeEvent'},
    {header: 'Fecha de inicio', tipo: 'inputFecha', nomAttribute: 'fecInicio'},
    {header: 'Fecha de Fin', tipo: 'inputFecha', nomAttribute: 'fecFin'},
    {header: 'Modalidad', tipo: 'select', opciones: this.opcionesModalidad, nomAttribute: 'typeModalidad'}
  ];

  dataTables = this.fb.array([
    this.fb.group({idUnidOperativ: [1], fecRegistro: [null], dataServiciosEnviado: new FormControl(), ctrlDataObt: new FormControl()})
  ]);

  dataServiciosEnviado = new FormControl();
  
  ctrlDataObtenida = new FormControl();
  
  constructor(private fb                      : FormBuilder, 
              private notificationService     : NotificationService,
              private datosGeneralesService   : DatosGeneralesService,
              private router                  : Router, 
              private route                   : ActivatedRoute) { }

  ngOnInit(){
    this.getDataServices();
    // let controlPrueba = this.fb.group({
    //   idUnidOperativ: [2],
    //   listServices: [[]]
    // });
    // (this.dataTables as FormArray).push(controlPrueba);
    // console.log(this.dataTables.get('0')!.value)
    this.dataTables.valueChanges.subscribe((data)=>{
      console.log(data);
    })
  }

  getDataServices(){
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

  aniadirFila(){
    this.dataServiciosEnviado.setValue({idServicio: 1})
  }

  goToConfirm(){
    this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}`])
  }

  addTablaUnid(){
    let controlPrueba = this.fb.group({
      idUnidOperativ: [null],
      fecRegistro: [null],
      dataServiciosEnviado: new FormControl(),
      ctrlDataObt: new FormControl(),
    });
    (this.dataTables as FormArray).push(controlPrueba);
  }

  addServiceToTablaUnid(index: number){
    this.dataTables.get(index.toString())!.get('dataServiciosEnviado')!.setValue({idServicio: 1})
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
