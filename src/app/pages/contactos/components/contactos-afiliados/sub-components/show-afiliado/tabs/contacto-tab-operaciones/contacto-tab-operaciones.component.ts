import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { AfiliacionesOperacionesService } from 'src/app/data/services/afiliaciones/afiliaciones-operaciones.service';
import { RequestListOperaciones } from '@models/afiliaciones/operaciones/evaluacion-operacion.model';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-contacto-tab-operaciones',
  templateUrl: './contacto-tab-operaciones.component.html',
  styleUrls: ['./contacto-tab-operaciones.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class ContactoTabOperacionesComponent implements OnInit {
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
              private notificationService                   : NotificationService) {
      this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!; }

  ngOnInit(): void {
    this.getData()
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
        console.log(this.listaOperaciones)
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
      var stringFecha = (new Date(new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay()+1)).toISOString())).toLocaleDateString();

      fecInicio = stringFecha.split('/')[2] + '-' + `0${stringFecha.split('/')[1]}`.slice(-2) + '-' + `0${stringFecha.split('/')[0]}`.slice(-2);
      fecFin = ((new Date()).toLocaleDateString()).split('/')[2] + '-' + `0${((new Date()).toLocaleDateString()).split('/')[1]}`.slice(-2) + '-' + `0${((new Date()).toLocaleDateString()).split('/')[0]}`.slice(-2);
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }

    console.log(fecInicio, fecFin)
    return {
      idFichaAdmision: parseInt(this.idFicha),
      fecInicio: fecInicio,
      fecFin: fecFin,
      pageNum: 1,
      pageSize: 100
    }
  }
}
