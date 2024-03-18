import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControlName, FormGroupDirective, FormGroupName, FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'esp-filtro-fecha',
  standalone:true,
  imports:[CommonModule, FormsModule, NgxDaterangepickerMd, CdkMenuModule],
  templateUrl: './filtro-fecha.component.html',
  styleUrls: ['./filtro-fecha.component.scss']
})
export class FiltroFechaComponent {

  @Input()
  setSelectionBg: string = '#14b8a6';

  @Input()
  setButtonBg: string = '#0d9488';

  @Input()
  setOptionSelected: string = '#0088CC';

  @Input()
  setTextColour: string = '#057EC9';

  @Output()
  sendDateFilter = new EventEmitter<any>(); //Se requiere de una funcion en donde se llame el valor seleccionado para, posteriormente, almacenarlo en donde se requiera
  
  @Output()
  sendDateFilterWithCeros = new EventEmitter<any>(); //Ejemplo 01/01/2023 - 02/02/2023

  @Output()
  sendDateFilterWithoutCeros = new EventEmitter<any>(); //Ejemplo 1/1/2023 - 2/2/2023

  @Output()
  sendDateFilterUSDate = new EventEmitter<any>(); //Ejemplo 06/23/2023 - 12/23/2023

  datoFecha!: string;

  selectedPersonalizado: boolean = false;

  opcionesFecha = [{descripcion: 'Hoy', accion: 1},
                   {descripcion: 'Ayer', accion: 2},
                   {descripcion: 'Esta Semana', accion: 3},
                   {descripcion: 'Semana Pasada', accion: 4},
                   {descripcion: 'Este Mes', accion: 5},
                   {descripcion: 'Mes Pasado', accion: 6},
                   {descripcion: 'Trimestre Actual', accion: 7},
                   {descripcion: 'Trimestre Anterior', accion: 8},
                   {descripcion: 'Este Año', accion: 9},
                   {descripcion: 'Año Pasado', accion: 10},
                   {descripcion: 'Personalizado', accion: 11}];
  selectedSize = {descripcion: '', accion: 0};

  @ViewChild('menu', { static: true }) menu!: TemplateRef<any>;

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  ngOnInit(): void {
    if(this.setSelectionBg != undefined){
      document.documentElement.style.setProperty('--fondo-selected-date',this.setSelectionBg);
    }
    else{
      document.documentElement.style.setProperty('--fondo-selected-date','#14b8a6');
    }
    if(this.setButtonBg != undefined){
      document.documentElement.style.setProperty('--fondo-choose-range-date',this.setButtonBg);
    }
    else{
      document.documentElement.style.setProperty('--fondo-choose-range-date','#0d9488');
    }
    if(this.setOptionSelected != undefined){
      document.documentElement.style.setProperty('--fondo-opcion-selected',this.setOptionSelected);
    }
    else{
      document.documentElement.style.setProperty('--fondo-opcion-selected','#0088CC');
    }
    if(this.setTextColour != undefined){
      document.documentElement.style.setProperty('--color-texto-selected',this.setTextColour);
    }
    else{
      document.documentElement.style.setProperty('--color-texto-selected','#057EC9');
    }
  }

  selectRangoFecha(value: number){
    this.selectedPersonalizado = false;
    var today = new Date();
    if (value == 1){
      var stringFecha = formatDate(today, 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha + ' - ' + stringFecha;
    }
    if (value == 2){
      var stringFecha = formatDate(new Date(today.valueOf() - 1000*60*60*24), 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha + ' - ' + stringFecha;
    }
    if (value == 3){
      let first = today.getDate() - today.getDay()+1;
      var stringFecha = formatDate(new Date(new Date(today.setDate(first)).toISOString()), 'dd/MM/yyyy', this.locale)+' - '+(formatDate(new Date(), 'dd/MM/yyyy', this.locale)); 
      this.datoFecha = stringFecha;
    }
    if (value == 4){
      let sundayLW = today.getDate() - today.getDay(); 
      if (today.getDay() == 0)
        sundayLW = sundayLW - 7;//obtiene domingo pasado
      let mondayLW = sundayLW - 6; //obtiene domingo pasado
      let segundoDia = new Date();
      var stringFecha = formatDate(new Date(new Date(today.setDate(mondayLW)).toISOString()), 'dd/MM/yyyy', this.locale)+' - '+(formatDate(new Date(segundoDia.setDate(sundayLW)), 'dd/MM/yyyy', this.locale));
      this.datoFecha = stringFecha;
    }
    if (value == 5){
      var stringFecha = formatDate(new Date(new Date(today.setDate(1)).toISOString()), 'dd/MM/yyyy', this.locale)+' - '+formatDate((new Date()), 'dd/MM/yyyy', this.locale);   
      this.datoFecha = stringFecha;
    }
    if (value == 6){
      let firstDayMonth = new Date();
      firstDayMonth.setDate(0); 
      var stringFecha = formatDate(new Date(new Date(firstDayMonth.setDate(1)).toISOString()), 'dd/MM/yyyy', this.locale)+' - '+formatDate(new Date(new Date(today.setDate(0)).toISOString()), 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha;
    }
    if (value == 7){
      switch (Math.floor((today.getMonth()+3)/3)) {
        case 1:
          today.setMonth(0)
          break;
        case 2:
          today.setMonth(3)       
          break;
        case 3:
          today.setMonth(6)           
          break;
        case 4:
          today.setMonth(9)           
          break;
      }
      today.setDate(1)
      var stringFecha = formatDate(today, 'dd/MM/yyyy', this.locale)+' - '+formatDate(new Date(), 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha;
    }
    if (value == 8){
      let segundoDia = new Date();
      switch (Math.floor((today.getMonth()+3)/3)) {
        case 1:
          today.setFullYear(today.getFullYear()-1)
          today.setMonth(9)
          segundoDia.setMonth(0)
          break;
        case 2:
          today.setMonth(0)
          segundoDia.setMonth(3)     
          break;
        case 3:
          today.setMonth(3)
          segundoDia.setMonth(6)          
          break;
        case 4:
          today.setMonth(6)
          segundoDia.setMonth(9)         
          break;
      }
      today.setDate(1)
      segundoDia.setDate(0)
      var stringFecha = formatDate(today, 'dd/MM/yyyy', this.locale)+' - '+formatDate(segundoDia, 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha;
    }
    if (value == 9){
      let firstDay = new Date();
      firstDay.setMonth(0);
      firstDay.setDate(1);
      var stringFecha = formatDate(firstDay, 'dd/MM/yyyy', this.locale)+' - '+formatDate(today, 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha;
    }
    if (value == 10){
      let firstDay = new Date();
      today.setMonth(0);
      today.setDate(0);
      firstDay.setFullYear(firstDay.getFullYear()-1);
      firstDay.setMonth(0);
      firstDay.setDate(1);
      var stringFecha = formatDate(firstDay, 'dd/MM/yyyy', this.locale)+' - '+formatDate(today, 'dd/MM/yyyy', this.locale);
      this.datoFecha = stringFecha;
    }
    this.orderDatesAsRequired(this.datoFecha, value);
    this.sendDateFilter.emit(this.datoFecha);
  }

  choosedDate(event : any){
    this.selectedSize = {descripcion: 'Personalizado', accion: 11};
    this.selectedPersonalizado = true;
    console.log(event.chosenLabel)
    this.datoFecha = event.chosenLabel.split('-')[0].trim()+' - '+event.chosenLabel.split('-')[1].trim();
    console.log(this.datoFecha);
    this.orderDatesAsRequired(this.datoFecha, 11);
    this.sendDateFilter.emit(this.datoFecha);
  }

  orderDatesAsRequired(rango:string, opcion:number){
    var rangoWithoutCeros, rangoWithCeros, rangoUS;
    var fecInicio, fecFin;
    var anioInicio, anioFin;
    var mesInicio, mesFin;
    var diaInicio, diaFin;
    fecInicio = rango.split(' - ')[0];
    fecFin = rango.split(' - ')[1];
    anioInicio = fecInicio.split('/')[2];
    anioFin = fecFin.split('/')[2];
    mesInicio = fecInicio.split('/')[1];
    mesFin = fecFin.split('/')[1];
    diaInicio = fecInicio.split('/')[0];
    diaFin = fecFin.split('/')[0];
    if (opcion < 11) {
      this.sendDateFilterWithoutCeros.emit(rango);
      diaInicio = this.convertToTwoDigits(diaInicio);
      mesInicio = this.convertToTwoDigits(mesInicio);
      diaFin = this.convertToTwoDigits(diaFin);
      mesFin = this.convertToTwoDigits(mesFin);
      fecInicio = diaInicio + '/' + mesInicio + '/' + anioInicio;
      fecFin = diaFin + '/' + mesFin + '/' + anioFin;
      rangoWithCeros = fecInicio + ' - ' + fecFin;
      this.sendDateFilterWithCeros.emit(rangoWithCeros);
      fecInicio = mesInicio + '/' + diaInicio + '/' + anioInicio;
      fecFin = mesFin + '/' + diaFin + '/' + anioFin;
      rangoUS = fecInicio + ' - ' + fecFin;
      this.sendDateFilterUSDate.emit(rangoUS);
    }
    else{
      this.sendDateFilterWithCeros.emit(rango);
      fecInicio = mesInicio + '/' + diaInicio + '/' + anioInicio;
      fecFin = mesFin + '/' + diaFin + '/' + anioFin;
      rangoUS = fecInicio + ' - ' + fecFin;
      this.sendDateFilterUSDate.emit(rangoUS);
      diaInicio = parseInt(diaInicio).toString();
      mesInicio = parseInt(mesInicio).toString();
      diaFin = parseInt(diaFin).toString();
      mesFin = parseInt(mesFin).toString();
      fecInicio = diaInicio + '/' + mesInicio + '/' + anioInicio;
      fecFin = diaFin + '/' + mesFin + '/' + anioFin;
      rangoWithoutCeros = fecInicio + ' - ' + fecFin;
      this.sendDateFilterWithoutCeros.emit(rangoWithoutCeros);
    }
  }

  convertToTwoDigits(n: string): string{
    var convert!: string;
    if(n.length == 1){
      convert = '0'+n;
    }
    else{
      convert = n;
    }
    return convert;
  }
  //Ejemplo de como era directamente en el html
  /*
  selectRangoFecha(value: number){
    var today = new Date();
    console.log(value);
    if (value == 1){
      var stringFecha = today.toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha + ' - ' + stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 2){
      var stringFecha = (new Date(today.valueOf() - 1000*60*60*24)).toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha + ' - ' + stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 3){
      let first = today.getDate() - today.getDay()+1;
      var stringFecha = (new Date(new Date(today.setDate(first)).toISOString())).toLocaleDateString()+' - '+((new Date()).toLocaleDateString());
      this.form.get('frmSearchDate')?.setValue(stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 4){
      let dimanchLW = today.getDate() - today.getDay(); 
      if (today.getDay() == 0)
        dimanchLW = dimanchLW - 7;//obtiene domingo pasado
      let lundiLW = dimanchLW - 6; //obtiene domingo pasado
      let segundoDia = new Date();
      var stringFecha = (new Date(new Date(today.setDate(lundiLW)).toISOString())).toLocaleDateString()+' - '+((new Date(segundoDia.setDate(dimanchLW))).toLocaleDateString());
      this.form.get('frmSearchDate')?.setValue(stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 5){
      var stringFecha = (new Date(new Date(today.setDate(1)).toISOString())).toLocaleDateString()+' - '+((new Date()).toLocaleDateString());
      this.form.get('frmSearchDate')?.setValue(stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 6){
      let firstDayMonth = new Date();
      firstDayMonth.setDate(0); 
      var stringFecha = (new Date(new Date(firstDayMonth.setDate(1)).toISOString())).toLocaleDateString()+' - '+(new Date(new Date(today.setDate(0)).toISOString())).toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 7){
      switch (Math.floor((today.getMonth()+3)/3)) {
        case 1:
          today.setMonth(0)
          break;
        case 2:
          today.setMonth(3)       
          break;
        case 3:
          today.setMonth(6)           
          break;
        case 4:
          today.setMonth(9)           
          break;
      }
      today.setDate(1)
      var stringFecha = today.toLocaleDateString()+' - '+(new Date()).toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha);
      this.alterDataTable(value, stringFecha);
    }
    if (value == 8){
      let segundoDia = new Date();
      switch (Math.floor((today.getMonth()+3)/3)) {
        case 1:
          today.setFullYear(today.getFullYear()-1)
          today.setMonth(9)
          segundoDia.setMonth(0)
          break;
        case 2:
          today.setMonth(0)
          segundoDia.setMonth(3)     
          break;
        case 3:
          today.setMonth(3)
          segundoDia.setMonth(6)          
          break;
        case 4:
          today.setMonth(6)
          segundoDia.setMonth(9)         
          break;
      }
      today.setDate(1)
      segundoDia.setDate(0)
      var stringFecha = today.toLocaleDateString()+' - '+segundoDia.toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha);
    }
    if (value == 9){
      let firstDay = new Date();
      firstDay.setMonth(0);
      firstDay.setDate(1);
      var stringFecha = firstDay.toLocaleDateString()+' - '+today.toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha);
    }
    if (value == 10){
      let firstDay = new Date();
      today.setMonth(0);
      today.setDate(0);
      firstDay.setFullYear(firstDay.getFullYear()-1);
      firstDay.setMonth(0);
      firstDay.setDate(1);
      var stringFecha = firstDay.toLocaleDateString()+' - '+today.toLocaleDateString();
      this.form.get('frmSearchDate')?.setValue(stringFecha);
    }
    console.log(this.form.value);
  }

  alterDataTable(valueAccion: number, stringFecha: string){
    // this.datasource2 = this.dataSourceRespaldo;
    // console.log(this.datasource2);
    if (valueAccion <= 2) {
      var dia = stringFecha.split('/');
      var fechaEvaluar = new Date(+dia[2], +dia[1]-1, +dia[0]);
      // this.datasource2 = this.dataSource.filter(function(x){
      //   // console.log((new Date(x.fecRegistro)).toLocaleDateString()," ----", fechaEvaluar.toLocaleDateString());
      //   return (new Date(x.fecRegistro)).toLocaleDateString() <= fechaEvaluar.toLocaleDateString();
      // });      
    }
    else{

    }
  }
  choosedDate(event : any){
    this.form.get('frmSearchDate')?.setValue(event.chosenLabel.split('-')[0].trim()+' - '+event.chosenLabel.split('-')[1].trim());
    this.selectedSize = {descripcion: 'Personalizado', accion: 11};
    console.log(event.chosenLabel.split(' - '));
  }
  */
}
