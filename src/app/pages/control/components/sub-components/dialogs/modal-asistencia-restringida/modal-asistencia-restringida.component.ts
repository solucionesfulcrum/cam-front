import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export type EstadoTiempo = "antes" | "enHora" | "despues";
export interface MensajeEstado {
  header: string;
  description: string;
}

@Component({
  selector: 'esp-modal-asistencia-restringida',
  templateUrl: './modal-asistencia-restringida.component.html',
  styleUrls: ['./modal-asistencia-restringida.component.scss']
})
export class ModalAsistenciaRestringidaComponent implements OnInit {

  fechaServidor!: Date;
  fechaInicioTaller!: Date;
  fechaFinTaller!: Date;

  diferenciaFecha!: number;

  dias!: number;
  horas!: number;
  minutos!: number;
  segundos!: number;

  faClose= faClose;
  

  fechaActualContando!: Date;
  contadorInterval!: NodeJS.Timer;

  estado!: EstadoTiempo;

  msg: Record<EstadoTiempo, MensajeEstado>= {
    "antes": {
      "header" : "Asistencia aún no disponible",
      "description" : "La toma de asistencia estará disponible en"
    },
    "enHora": {
      "header" : "Asistencia disponible",
      "description" : "La toma de asistencia ya se encuentra disponible"
    },
    "despues": {
      "header" : "Asistencia ya fue llevada a cabo",
      "description" : ""
    }
  }

  constructor(
    @Inject(DIALOG_DATA) public data      : ModalAsistenciaRestringidaComponent,
    private _dialogRef                    : DialogRef<any>) 
    {
      this.fechaServidor = data.fechaServidor;
      this.fechaInicioTaller = data.fechaInicioTaller;
      this.fechaFinTaller = data.fechaFinTaller;

      this.fechaActualContando = this.fechaServidor;
  }

  ngOnInit() {
    this.fechaActualContando = new Date(this.fechaActualContando.getTime() + 1000); 
    this.calcularDiferencias();
    this.EvalHoras();

    this.iniciarContador();
  }

  iniciarContador() {
    this.contadorInterval = setInterval(() => {
      this.fechaActualContando = new Date(this.fechaActualContando.getTime() + 1000); 
      this.EvalHoras();
    }, 1000); 
  }

  ngOnDestroy() {
    clearInterval(this.contadorInterval);
  }


EvalHoras(): void {
  if(this.fechaActualContando > this.fechaFinTaller){
    this.estado = "despues";
    clearInterval(this.contadorInterval);
  }
  else{
    if(this.fechaActualContando >= this.fechaInicioTaller){
      this.estado = "enHora";
    }
    else{
      this.estado = "antes";
      this.calcularDiferencias();
    }
  }
}

calcularDiferencias() {
  this.diferenciaFecha = this.fechaInicioTaller.getTime() - new Date().getTime();

  this.dias = Math.floor(this.diferenciaFecha / (1000 * 60 * 60 * 24));
  this.horas = Math.floor((this.diferenciaFecha % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  this.minutos = Math.floor((this.diferenciaFecha % (1000 * 60 * 60)) / (1000 * 60));
  this.segundos = Math.floor((this.diferenciaFecha % (1000 * 60)) / 1000);
}

  

  onClose(){
  this._dialogRef.close({
    success: this.estado
  });
  }
  
}
