import { Component } from '@angular/core';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-programados',
  templateUrl: './programados.component.html',
  styleUrls: ['./programados.component.scss']
})
export class ProgramadosComponent {
  constructor(
    private datosService: DatosGeneralesService) { }
  mes = '';
  meses:any[] = [];
  ListaProgramacines: any[] = [];
  
  grabarDatosPersonales() { }

  ngOnInit() {
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa

    this.meses = ["ENE", "FEB", "MAR", "ABR", "MAYO", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
    const fecha = new Date("2024-04-11");
    this.mes = this.meses[fecha.getMonth()];
    this.datosService.getlistaProgramacion(idUsuario,"2024-04-11").subscribe((data) => {
      console.log("data", data.data);
      this.ListaProgramacines = data.data
    });
  }
  getMes(fecha: string): string {
    const date = new Date(fecha);
    return this.meses[date.getMonth()];
  }

  formatoFecha(fecha: string){
    const date = new Date(fecha);
    const fechaFormateada = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    return fechaFormateada;
  }
}
