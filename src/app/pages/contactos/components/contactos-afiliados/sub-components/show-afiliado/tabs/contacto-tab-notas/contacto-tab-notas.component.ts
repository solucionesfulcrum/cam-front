import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestListEvaluaciones } from '@models/afiliaciones/operaciones/evaluacion-operacion.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesOperacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-operaciones.service';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';

@Component({
  selector: 'esp-contacto-tab-notas',
  templateUrl: './contacto-tab-notas.component.html',
  styleUrls: ['./contacto-tab-notas.component.scss']
})
export class ContactoTabNotasComponent {
  formBuscar: FormGroup = this.fb.group({
    frmSearchDate:new FormControl(""),
    // frmSearchEstado:new FormControl(), //  Mantener para el caso del select
  });
  dataShow = false;

  faSpinner = faSpinner;
  idFicha: string = '';
  pseudoInfoOperaciones: any[] = [
    {descripcion: 'Marco Asistencia en el taller de Yoga', fecha: new Date('2023-07-18 11:39 AM')},
    {descripcion: 'Marco Asistencia en el taller de Yoga', fecha: new Date('2023-07-12 11:39 AM')},
    {descripcion: 'Solicito unirse al proyecto CAM', fecha: new Date('2023-05-26 08:39 AM')},
    {descripcion: 'Finalizo la Evaluación siendo aceptado en el proyecto CAM', fecha: new Date('2023-05-26 11:39 AM')},
    {descripcion: 'Se le asigno al CAM lima Centro', fecha: new Date('2023-05-26 02:39 PM')},
  ];

  listaNotas: any[] = [];

  constructor(private fb                                    : FormBuilder, 
              private afiliacionesService                    : AfiliacionesSolicitudesService,
              private activeRoute                           : ActivatedRoute,
              private router                           : Router,
              @Inject(LOCALE_ID) private locale             : string,
              private notificationService                   : NotificationService) {
      //this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!; 
    
    }

  ngOnInit(): void {
    const url = this.router.url;
    let idFicha;

    if(url.indexOf('busqueda') !== -1){
      const startIndex = url.indexOf('/busqueda/') + '/busqueda/'.length;
      const endIndex = url.indexOf('/', startIndex);
      idFicha = url.substring(startIndex, endIndex !== -1 ? endIndex : undefined);
    }
    else{
      const startIndex = url.indexOf('/show/') + '/show/'.length;
      const endIndex = url.indexOf('/', startIndex);
      idFicha = url.substring(startIndex, endIndex !== -1 ? endIndex : undefined);
    }
    
  

    this.idFicha = idFicha;
    this.getData();
  }
  
  /*
 this.solicitudServicio.listarNotaSolicitud(this.data.idSolicitud).subscribe((data)=>{
      if (data.code == 0) {
        this.registrosNotas = data.data;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  */


  getData(){
    this.dataShow = false;
    this.afiliacionesService.listarNotaSolicitud(this.idFicha).subscribe((data)=>{
      if (data.code == 0) {
        this.listaNotas = data.data
        /*.reduce((groups: any, operacion: any) => {
          const date = new Date(operacion.fechaEvaluacion).toDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(operacion);
          return groups;
        }, {});
        this.listaOperaciones = Object.keys(this.listaOperaciones).map((fechaEvaluacion: any) => {
          return {
            fechaEvaluacion,
            operaciones: this.listaOperaciones[fechaEvaluacion]
          };
        });*/
        this.dataShow = true;
      }
      else{
        this.notificationService.warning(data.message);
      }
        
    })
  }

}
