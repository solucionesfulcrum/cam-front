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
  meses: any[] = [];
  ListaProgramacines: any[] = [];
  imagenFoto: any = null;
  fechInicio: any = null;
  select: any = null;
  activeButton: number | null = null;
  selectedProgramacion: any;

  buttons = [
    { label: 'Hoy', method: () => this.hoy() },
    { label: 'Mañana', method: () => this.manana() },
    { label: 'Esta Semana', method: () => this.estaSemana() },
    { label: 'La Proxima Semana', method: () => this.proximaSemana() },
    { label: 'Este Mes', method: () => this.esteMes() },
    { label: 'El proximo mes', method: () => this.proximoMes() }
  ];

  setActive(index: number) {
    this.activeButton = index;
    console.log("index", index)
    this.buttons[index].method();
  }

  hoy() {
    const fechaActual = new Date().toISOString().split('T')[0];
    this.getListaProgramaciones(fechaActual, fechaActual)
    this.activeButton = 0
    this.selectedProgramacion = null;
  }

  manana() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const fechaManana = now.toISOString().split('T')[0];
    this.getListaProgramaciones(fechaManana, fechaManana)
    this.selectedProgramacion = null;
  }

  estaSemana() {
    this.getListaProgramaciones("2024-05-06", "2024-05-11")
    this.selectedProgramacion = null;
  }

  proximaSemana() {
    this.getListaProgramaciones("2024-05-13", "2024-05-18")
    this.selectedProgramacion = null;
  }

  esteMes() {
    this.getListaProgramaciones("2024-05-01", "2024-05-31")
    this.selectedProgramacion = null;
  }

  proximoMes() {
    this.getListaProgramaciones("2024-06-01", "2024-06-30")
    this.selectedProgramacion = null;
  }

  getListaProgramaciones(fechInicio: string, fechFin: string) {
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.datosService.getlistaProgramacion(idUsuario, fechInicio, fechFin).subscribe((data) => {
      console.log("data", data.data);
      console.log("data", new Date);
      this.ListaProgramacines = data.data
    });
  }

  ngOnInit() {
    const idUsuario = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa
    this.fechInicio = "2024-04-11"
    this.meses = ["ENE", "FEB", "MAR", "ABR", "MAYO", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
    const fecha = new Date("2024-04-11");
    this.mes = this.meses[fecha.getMonth()];
    this.hoy();
  }
  getMes(fecha: string): string {
    const date = new Date(fecha);
    return this.meses[date.getMonth()];
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
