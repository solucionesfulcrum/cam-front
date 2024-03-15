import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

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

  opcionesEvento: TablaOpciones[] = [
    {idOpcion: 1, nombre: 'Taller', value: 1},
    {idOpcion: 2, nombre: 'Festividad', value: 2},
    {idOpcion: 3, nombre: 'Curso', value: 3},
  ];
  opcionesModalidad: TablaOpciones[] = [
    {idOpcion: 1, nombre: 'Presencial', value: 1},
    {idOpcion: 2, nombre: 'Virtual', value: 2},
    {idOpcion: 3, nombre: 'Híbrido', value: 3},
  ];
  
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
              private router                  : Router, 
              private route                   : ActivatedRoute) { }

  ngOnInit(){
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
