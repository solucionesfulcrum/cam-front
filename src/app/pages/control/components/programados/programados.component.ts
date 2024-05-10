import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-programados',
  templateUrl: './programados.component.html',
  styleUrls: ['./programados.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class ProgramadosComponent {
  status: RequestStatus = 'init';
  
  constructor(private datosService                      : DatosGeneralesService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              ) { }
  ListaProgramacines: any[] = [];
  imagenFoto: any = null;
  fechInicio: any = null;
  select: any = null;
  activeButton: number | null = null;
  selectedProgramacion: any;

  buttons = [
    { label: 'Hoy', method: () => this.getFiltrosFecha(1) },
    { label: 'Mañana', method: () => this.getFiltrosFecha(2) },
    { label: 'Esta Semana', method: () => this.getFiltrosFecha(3) },
    { label: 'La Proxima Semana', method: () => this.getFiltrosFecha(4) },
    { label: 'Este Mes', method: () => this.getFiltrosFecha(5) },
    { label: 'El proximo mes', method: () => this.getFiltrosFecha(6) }
  ];

  setActive(index: number) {
    this.activeButton = index;
    console.log("index", index)
    this.buttons[index].method();
  }

  getFiltrosFecha(opt: number){
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
    this.getListaProgramaciones(fechaInit, fechaFin)
    this.selectedProgramacion = null;    
  }

  // hoy() {
  //   const fechaActual = new Date().toISOString().split('T')[0];
  //   this.getListaProgramaciones(fechaActual, fechaActual)
  //   this.activeButton = 0
  //   this.selectedProgramacion = null;
  // }
  // manana() {
  //   const now = new Date();
  //   now.setDate(now.getDate() + 1);
  //   const fechaManana = now.toISOString().split('T')[0];
  //   this.getListaProgramaciones(fechaManana, fechaManana)
  //   this.selectedProgramacion = null;
  // }

  // estaSemana() {
  //   this.getListaProgramaciones("2024-05-06", "2024-05-11")
  //   this.selectedProgramacion = null;
  // }

  // proximaSemana() {
  //   this.getListaProgramaciones("2024-05-13", "2024-05-18")
  //   this.selectedProgramacion = null;
  // }

  // esteMes() {
  //   this.getListaProgramaciones("2024-05-01", "2024-05-31")
  //   this.selectedProgramacion = null;
  // }

  // proximoMes() {
  //   this.getListaProgramaciones("2024-06-01", "2024-06-30")
  //   this.selectedProgramacion = null;
  // }

  getListaProgramaciones(fechInicio: string, fechFin: string) {
    this.status = 'loading';
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.datosService.getlistaProgramacion(idUsuario, fechInicio, fechFin).subscribe((data) => {
      if (data.code == 0) {
        this.status = 'success';
        console.log("data", data.data);
        console.log("data", new Date);
        this.ListaProgramacines = data.data
      }
      else{
        this.status = 'failed';
        this.notificacionService.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.getFiltrosFecha(1);
  }

  formatoFecha(fecha: string) {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    return fechaFormateada;
  }

  selectProg(prog: any): void {
    this.selectedProgramacion = prog;
    console.log('Selected Programación:', this.selectedProgramacion);
  }
}
