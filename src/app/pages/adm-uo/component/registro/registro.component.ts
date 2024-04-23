import { Component } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';

@Component({
  selector: 'esp-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Guardar y registrar otro', colorBtn:'mezclado', loading: false},
    {texto: 'Guardar', colorBtn:'mezclado'},
  ];

  optFunc(opt: number){
    switch (opt) {
      case 1:
        /*this.router.navigate(['app/contratos'])
        break;*/
      case 2:
        /*if (this.validacionDataTable()) {
          this.opcionesBotones[1].loading = true;
          this.contratoService.saveDataDetalleContrato(this.getPayloadAsignacion()).subscribe((data)=>{
            if (data.code == 0) {
              this.opcionesBotones[1].loading = false;
              this.notificationService.success('¡Se guardaron los datos del contrato!');
            }
            else{
              this.opcionesBotones[1].loading = false;
              this.notificationService.warning(data.message);
            }
          })
        }
        break;*/
      case 3:
        /*if (this.validacionDataTable()) {
          const dialogRef = this.dialog.open(DialogConfirmSelectionComponent,{
            data:{
              title: '¿Está seguro de confirmar el contrato?',
              message: `De confirmarse, no se podrá volver a editar`,
              type: 1,
              dataRequired: this.getPayloadAsignacion()
            }
          })
      
          dialogRef.closed.subscribe(result => {
            if (result == 1) {
              this.router.navigate([`app/${AppRoute.CONTRATOS}/${AppRoute.CONTRATOS_CONFIRMAR_SERVICIOS}/${this.numOc}`]);
            }
          });
        }        
        break;*/
    }
  }
}
