import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { AtencionCitasService } from '@services/atencion/atencion-citas.service';
import { FormatoCartilla } from '@shared/components/cartilla-info/formato-cartilla.model';
import { DialogConfirmAtencionMedicaComponent } from './dialog-confirm-atencion-medica/dialog-confirm-atencion-medica.component';

@Component({
  selector: 'esp-atencion-pendiente',
  templateUrl: './atencion-pendiente.component.html',
  styleUrls: ['./atencion-pendiente.component.scss']
})
export class AtencionPendienteComponent {
  selected =  new Date();

  horas: string[] = ['07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM']
  
  atencionesPendientes: FormatoCartilla[] = [];
  
  constructor(private atencionServices                                    : AtencionCitasService,
              private dialog                                              : Dialog,){

  }

  ngOnInit(){
    this.onSelect()
  }

  onSelect(){
    this.atencionesPendientes = [];
    this.atencionServices.getCitasDia(this.selected).forEach((x)=>{
      let cartilla: FormatoCartilla = Object();
      cartilla.idActividad = x.id;
      cartilla.actividadNombre = x.nombreActividad;
      cartilla.estadoCartilla = x.estadoAtencion;
      cartilla.fechaProgramadaInicio = x.horaInicio;
      cartilla.fechaProgramadaFin = x.horaFin;
      cartilla.fechaCreacion = x.fecha;
      cartilla.nombrePersona = x.persona;
      cartilla.numeroPersona = x.numPersona;
      this.atencionesPendientes.push(cartilla);
    })
    this.atencionesPendientes.sort((a, b)=>{ return a.fechaProgramadaFin!.getTime() - b.fechaProgramadaFin!.getTime() })
  }

  getCitasHorario(hora: string): any{
    let fechaString = new Date(`${this.selected.getFullYear()}-${this.selected.getMonth() + 1}-${this.selected.getDate()} ${hora}`);

    this.atencionesPendientes.filter((x)=> {return x.fechaProgramadaInicio!.getHours() == fechaString.getHours()})
    return this.atencionesPendientes.filter((x)=> x.fechaProgramadaInicio!.getHours() == fechaString.getHours())
  }

  showAtencionMedica(dataCita: any){
    const dialogRef = this.dialog.open(DialogConfirmAtencionMedicaComponent,{
      minWidth:'400px',
      width:'60vw',
      maxWidth:'800px',
      data:{
        obj: dataCita
      }
    })
  }
}
