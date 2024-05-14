import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { NotificationService } from '@services/notification.service';
import { debounceTime } from 'rxjs';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'esp-tab-mis-talleres',
  templateUrl: './tab-mis-talleres.component.html',
  styleUrls: ['./tab-mis-talleres.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class TabMisTalleresComponent {
  status: RequestStatus = 'init';
  ListaProgramacines: any[] = [];
  faSpinner = faSpinner;
  ctrlSearch = new FormControl('');
  ctrlInit = new FormControl('');
  ctrlFin = new FormControl('');
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
  
  constructor(private datosService                      : DatosGeneralesService,
              private router                            : Router,
              private controlService                    : ControlProgramacionService,
              @Inject(LOCALE_ID) private locale         : string,
              private notificacionService               : NotificationService,
              ) { }

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
    this.ctrlInit.setValue(fechaInit);
    this.ctrlFin.setValue(fechaFin);
    this.getListaProgramaciones()
    this.selectedProgramacion = null;    
  }

  getListaProgramaciones() {
    this.status = 'loading';
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.controlService.getlistaProgramacion(idUsuario, this.ctrlInit.value!, this.ctrlFin.value!, this.ctrlSearch.value!.toUpperCase()).subscribe((data) => {
      if (data.code == 0) {
        this.status = 'success';        
        console.log("data", data.data);
        this.ListaProgramacines = data.data;
        if (data.data.length > 0) {
          this.selectedProgramacion = data.data[0];
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
  }

  selectProg(prog: any): void {
    this.selectedProgramacion = prog;
  }

  goAsistencia(){
    localStorage.setItem('idProgramElegida', JSON.stringify(this.selectedProgramacion.idProgDet));    
    this.router.navigate(['/app/control/control-asistencia'])
  }

}
