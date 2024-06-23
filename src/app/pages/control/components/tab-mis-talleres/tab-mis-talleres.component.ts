import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestRegisterCabecera } from '@models/control/asistencia/service-asistencia.model';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { debounceTime } from 'rxjs';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ModalAsistenciaRestringidaComponent } from '../sub-components/dialogs/modal-asistencia-restringida/modal-asistencia-restringida.component';
import { Dialog } from '@angular/cdk/dialog';

export type EstadoTiempo = "antes" | "enHora" | "despues";


registerLocaleData(localeEs, 'es');
@Component({
  selector: 'esp-tab-mis-talleres',
  templateUrl: './tab-mis-talleres.component.html',
  styleUrls: ['./tab-mis-talleres.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabMisTalleresComponent {
  status: RequestStatus = 'init';
  statusAsistencia: RequestStatus = 'init';
  ListaProgramacines: any[] = [];
  faSpinner = faSpinner;
  ctrlSearch = new FormControl('');
  // Control del Tiempo -------------------------------------------------------------
  ctrlTiempo = new FormControl();
  ctrlFinTaller = new FormControl();
  bloqueo: boolean = true;
  // --------------------------------------------------------------------------------
  ctrlInit = new FormControl('');
  ctrlFin = new FormControl('');
  imagenFoto: any = null;
  fechInicio: any = null;
  select: any = null;
  activeButton: number | null = null;
  selectedProgramacion: any;

  fechaActualServidor!: Date;

  estadoTiempo!: EstadoTiempo;

  statusLoadingAsistencia: boolean = false;

  idProgramacionElegida: string = String(JSON.parse(localStorage.getItem('idProgramElegida')!));

  buttons = [
    { label: 'Hoy', method: () => this.getFiltrosFecha(1) },
    { label: 'Mañana', method: () => this.getFiltrosFecha(2) },
    { label: 'Esta Semana', method: () => this.getFiltrosFecha(3) },
    { label: 'La Proxima Semana', method: () => this.getFiltrosFecha(4) },
    { label: 'Este Mes', method: () => this.getFiltrosFecha(5) },
    { label: 'El proximo mes', method: () => this.getFiltrosFecha(6) }
  ];
  indexSelectedButton!: number;
  
  constructor(private datosService                      : DatosGeneralesService,
              private router                            : Router,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              private dialog : Dialog,
              ) { }

  setActive(index: number) {
    this.activeButton = index;
    this.buttons[index].method();
  }

  getFiltrosFecha(opt: number){
    this.indexSelectedButton = opt - 1;
    let fechaInit = '';
    let fechaFin = '';
    // Dias Comprobación -------------------------------------------
    let dateUno: Date;
    let dateDos: Date;
    // -------------------------------------------------------------
    this.activeButton = opt - 1;
    switch (opt) {
      case 1:
        fechaInit = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
        break;
      case 2:
        dateUno = new Date(new Date().getTime() + 1000*60*60*24);
        dateDos = new Date(new Date().getTime() + 1000*60*60*24);
        fechaInit = formatDate(dateUno, 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(dateDos, 'yyyy-MM-dd', this.locale);
        break;
      case 3:
        dateUno = new Date(new Date().getTime() - 1000*60*60*24*(new Date().getDay()));
        dateDos = new Date(dateUno.getTime() + 1000*60*60*24*6);
        fechaInit = formatDate(dateUno, 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(dateDos, 'yyyy-MM-dd', this.locale);
        break;
      case 4:
        dateUno = new Date(new Date().getTime() - 1000*60*60*24*(new Date().getDay()) + 1000*60*60*24*7);
        dateDos = new Date(dateUno.getTime() + 1000*60*60*24*6);
        fechaInit = formatDate(dateUno, 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(dateDos, 'yyyy-MM-dd', this.locale);
        break;
      case 5:
        dateUno = new Date(new Date().setDate(1));
        dateDos = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        fechaInit = formatDate(dateUno, 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(dateDos, 'yyyy-MM-dd', this.locale);        
        break;
      case 6:
        dateUno = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        dateDos = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);
        fechaInit = formatDate(dateUno, 'yyyy-MM-dd', this.locale);
        fechaFin = formatDate(dateDos, 'yyyy-MM-dd', this.locale);
        break;
    }
    this.ctrlInit.setValue(fechaInit);
    this.ctrlFin.setValue(fechaFin);
    this.getListaProgramaciones()
    this.selectedProgramacion = null;    
  }

  getListaProgramaciones() {
    this.status = 'loading';
    this.selectedProgramacion = null;
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.controlService.getlistaProgramacion(idUsuario, this.ctrlInit.value!, this.ctrlFin.value!, this.ctrlSearch.value!.toUpperCase()).subscribe((data) => {
      if (data.code == 0) {
        this.status = 'success';
        this.ListaProgramacines = data.data;
        if (data.data.length > 0) {
          if(this.idProgramacionElegida.length > 0){
            if(data.data.filter((programacion : any) => programacion.idProgDet == this.idProgramacionElegida).length > 0){
              this.selectProg(data.data.filter((programacion : any) => programacion.idProgDet == this.idProgramacionElegida)[0])
            }
            else{
              this.selectProg(data.data[0]);
            }
           
          }else{
            this.selectProg(data.data[0]);
          }
        }
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.getFiltrosFecha(1);
    this.ctrlSearch?.valueChanges.pipe(debounceTime(1000)).subscribe(key => {
      this.getListaProgramaciones();
    })
    this.getFechaServidor();
  }

  getFechaServidor(){
    this.datosService.getFechaServidor().subscribe(fechaData=>{
      this.fechaActualServidor = new Date(fechaData.data.fechaHoraActual);
    })
  }

  selectProg(prog: any): void {
    this.selectedProgramacion = prog;
    this.getIsTime()
  }

  consultarDataPrograma(){
    this.statusLoadingAsistencia = true;
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.datosService.getlistaProgramacion(idUsuario, this.ctrlInit.value!, this.ctrlFin.value!, this.ctrlSearch.value!.toUpperCase()).subscribe((data) => {
      if (data.code == 0) {
        let programaciones = data.data as [];
        this.selectedProgramacion = programaciones.filter((programacion : any) => programacion.idProgDet == this.selectedProgramacion.idProgDet)[0];
        this.datosService.getFechaServidor().subscribe(fechaData=>{
          this.statusLoadingAsistencia = false;
          this.fechaActualServidor = new Date(fechaData.data.fechaHoraActual);
          this.getTimeAndAsistir();
        })
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(data.message);
      }
    });
  }

  goAsistencia(){
    if(this.bloqueo){
      const dialogRef = this.dialog.open(ModalAsistenciaRestringidaComponent,{
        minWidth:'500px',
        maxWidth:'30%',
        width:'500px',
        data:{
          fechaServidor: this.fechaActualServidor,
          fechaFinTaller: new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaFin),
          fechaInicioTaller: new Date(new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaInicio).getTime() - 20*60*1000),
        }
      })
      dialogRef.closed.subscribe(out =>{
        //this.onLoadData();
      })
    }
    else{
      if(this.estadoTiempo == "despues"){
        const dialogRef = this.dialog.open(ModalAsistenciaRestringidaComponent,{
          minWidth:'500px',
          maxWidth:'30%',
          width:'500px',
          data:{
            fechaServidor: this.fechaActualServidor,
            fechaFinTaller: new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaFin),
            fechaInicioTaller: new Date(new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaInicio).getTime() - 20*60*1000),
          }
        })
        dialogRef.closed.subscribe((out : any) =>{
          
          if(out.success == "despues"){

            this.statusAsistencia = 'loading';
            let payload: RequestRegisterCabecera = {
              idProgramacionDet: this.selectedProgramacion.idProgDet,
              userCreacion: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
            };
            this.controlService.registerDataAsistenciaCabecera(payload).subscribe((data)=>{
              if (data.code == 0) {
                this.statusAsistencia = 'success';
                localStorage.setItem('idProgramElegida', JSON.stringify(this.selectedProgramacion.idProgDet));    
                this.router.navigate(['/app/control/control-asistencia'])
              }
              else{
                this.statusAsistencia = 'failed';
                this.notificacionService.warning(data.message);
              }
            })
          }
        
        })
      }
      else{
        this.statusAsistencia = 'loading';
      let payload: RequestRegisterCabecera = {
        idProgramacionDet: this.selectedProgramacion.idProgDet,
        userCreacion: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario,
      };
      this.controlService.registerDataAsistenciaCabecera(payload).subscribe((data)=>{
        if (data.code == 0) {
          this.statusAsistencia = 'success';
          localStorage.setItem('idProgramElegida', JSON.stringify(this.selectedProgramacion.idProgDet));    
          this.router.navigate(['/app/control/control-asistencia'])
        }
        else{
          this.statusAsistencia = 'failed';
          this.notificacionService.warning(data.message);
        }
      })
      }
      
    }
  }

  getTimeAndAsistir(){
    let fechaServidor : Date = this.fechaActualServidor;
    let fechaFinTaller : Date = new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaFin);
    let fechaInicioTaller : Date = new Date(new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaInicio).getTime() - 20*60*1000);

    if(fechaServidor > fechaFinTaller){
      this.bloqueo = false;
      this.estadoTiempo = "despues";
    }
    else{
      if(fechaServidor >= fechaInicioTaller){
        this.bloqueo = false;
      }
      else{
        this.bloqueo = true;
      }
    }

    this.goAsistencia();
  }

  getIsTime(){
    this.ctrlFinTaller.setValue(null, {emitEvent: false});
    let thisTime = this.fechaActualServidor;
    let finTaller = new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaFin);
    if (finTaller.getTime() < thisTime.getTime()) {
      this.bloqueo = true;
    }
    else{
      let inicioTaller = new Date(new Date(this.selectedProgramacion.fecha + ' ' + this.selectedProgramacion.horaInicio).getTime() - 20*60*1000);
      let timer: number = 0;
      if (inicioTaller.getTime() <= this.fechaActualServidor.getTime()) {
        this.bloqueo = false;
        timer = finTaller.getTime() - this.fechaActualServidor.getTime();
        this.ctrlTiempo?.valueChanges.pipe(debounceTime(timer)).subscribe(key => {
          if (timer == this.ctrlTiempo.value) {
            this.bloqueo = true;
          }
        })
        this.ctrlTiempo.setValue(timer)
      }
      else{
        timer = inicioTaller.getTime() - this.fechaActualServidor.getTime();
        if (timer >= (1000*60*60*14)) {
          this.bloqueo = true;
        }
        else{
          this.ctrlTiempo?.valueChanges.pipe(debounceTime(timer)).subscribe(key => {
            if (timer == this.ctrlTiempo.value) {
              this.bloqueo = false;
            }
          })
          this.ctrlTiempo.setValue(timer);

          let timerFinal = finTaller.getTime() - this.fechaActualServidor.getTime();
          this.ctrlFinTaller?.valueChanges.pipe(debounceTime(timerFinal)).subscribe(key => {
            if (timerFinal == this.ctrlFinTaller.value) {
              this.bloqueo = true;
            }
          })
          this.ctrlFinTaller.setValue(timerFinal);
        }
      }
    }
  }

}
