import { formatDate, registerLocaleData } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestListOperaciones } from '@models/afiliaciones/operaciones/evaluacion-operacion.model';
import { NotificationService } from '@services/notification.service';
import { AfiliacionesOperacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-operaciones.service';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-contacto-tab-evaluaciones',
  templateUrl: './contacto-tab-evaluaciones.component.html',
  styleUrls: ['./contacto-tab-evaluaciones.component.css']
})
export class ContactoTabEvaluacionesComponent implements OnInit {

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

  listaOperaciones: any[] = [];

  constructor(private fb                                    : FormBuilder, 
              private operacionesService                    : AfiliacionesOperacionesService,
              private activeRoute                           : ActivatedRoute,
              private router                           : Router,
              @Inject(LOCALE_ID) private locale             : string,
              private notificationService                   : NotificationService) {
      //this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!; 
    
    }

  ngOnInit(): void {
    const url = this.router.url;
    
    const startIndex = url.indexOf('/show/') + '/show/'.length;
    const endIndex = url.indexOf('/', startIndex);
    const idFicha = url.substring(startIndex, endIndex !== -1 ? endIndex : undefined);

    this.idFicha = idFicha;
  }
  
  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.getData();
  }


  getData(){
    this.dataShow = false;
    this.operacionesService.getListOperaciones(this.getModel()).subscribe((data)=>{
      if (data.code == 0) {
        this.listaOperaciones = data.data.list.reduce((groups: any, operacion: any) => {
          const date = new Date(operacion.fecha).toDateString();
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(operacion);
          return groups;
        }, {});
        this.listaOperaciones = Object.keys(this.listaOperaciones).map((fecha: any) => {
          return {
            fecha,
            operaciones: this.listaOperaciones[fecha]
          };
        });
        this.dataShow = true;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  getModel(): RequestListOperaciones{
    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      let todayDate = new Date();      
      var stringFecha = formatDate(new Date(new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay()+1)).toISOString()), 'dd/MM/yyyy', this.locale);

      fecInicio = stringFecha.split('/')[2] + '-' + `0${stringFecha.split('/')[1]}`.slice(-2) + '-' + `0${stringFecha.split('/')[0]}`.slice(-2);
      fecFin = formatDate((new Date()), 'yyyy-MM-dd', this.locale);
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }
    //console.log(fecInicio, fecFin)
    return {
      idFichaAdmision: parseInt(this.idFicha),
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: 1,
      pageSize: 100
    }
  }

}
