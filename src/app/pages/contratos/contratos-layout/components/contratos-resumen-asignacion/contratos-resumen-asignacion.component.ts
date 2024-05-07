import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import localeEs from '@angular/common/locales/es';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ContratosAdministracionService } from 'src/app/data/services/contratos/contratos-administracion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Dialog } from '@angular/cdk/dialog';
import { DialogConfirmSelectionComponent } from '../dialog/dialog-confirm-selection/dialog-confirm-selection.component';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-contratos-resumen-asignacion',
  templateUrl: './contratos-resumen-asignacion.component.html',
  styleUrls: ['./contratos-resumen-asignacion.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class ContratosResumenAsignacionComponent {
  rutas = AppRoute;
  faSpinner = faSpinner;
  numOc: any;
  dataContrato: any;

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Eliminar Contrato', colorBtn: 'bordeado', deshabilitado: true, tooltip:'Los contratos confirmados no pueden eliminarse sin autorización de un administrador'},
    {texto: 'Editar', colorBtn: 'bordeado', deshabilitado: true},
    {texto: 'Confirmar Contrato', colorBtn:'mezclado', deshabilitado: true},
  ];  

  constructor(private router                              : Router,
              private datosService                        : DatosGeneralesService,
              private dialog                              : Dialog,
              private activeRoute                         : ActivatedRoute,
              private contratosService                    : ContratosAdministracionService,
              private notificationService                 : NotificationService) {
      
              this.numOc = this.activeRoute.snapshot.paramMap.get('codOrden')!;
  }

  ngOnInit(){
    this.contratosService.getDataFromOC(this.numOc).subscribe((data)=>{
      if (data.code == 0) {
        if (data.data.datosContrato.estado === 'CONFIRMADO') {
          this.dataContrato = data.data;
          console.log(this.dataContrato)
        }
        else{
          this.router.navigate([`app/${this.rutas.CONTRATOS}/${this.rutas.CONTRATOS_ASIGNAR_SERVICIOS}/${this.numOc}`])
          this.notificationService.warning(`La Orden de compra ${this.numOc} no ha sido confirmada`)
        }
      }
      else {
        this.notificationService.warning(data.message);
      }
    })
  }
  deleteItem(){
    const dialogRef = this.dialog.open(DialogConfirmSelectionComponent,{
      data:{
        title: '¿Quiere borrar el registro?',
        message: `Se eliminará la Orden de Compra ${this.dataContrato.datosContrato.nroContrato}`,
        type: 0,
        dataRequired: this.dataContrato.datosContrato.idContrato
      }
    })

    dialogRef.closed.subscribe(result => {
      if (result == 1) {
        this.router.navigate([`app/${this.rutas.CONTRATOS}`])
      }
    });
  }
}
