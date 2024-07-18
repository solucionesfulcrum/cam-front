import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Parametro } from '@models/parametros-busqueda.model';
import { UsersService } from '@services/users.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';

@Component({
  selector: 'esp-asignar-rol-modal',
  templateUrl: './asignar-rol-modal.component.html',
  styleUrls: ['./asignar-rol-modal.component.scss']
})
export class AsignarRolModalComponent {
  mensaje: string = "";
  faClose = faClose
  statusLoadContacto: boolean = true;

  opciones: any[] = [];

  public form = this.fb.nonNullable.group({
    frmTipoDoc: ['80', [Validators.required]],
    frmNumdoc: ['', [Validators.required]],
  });


  
  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalAlertComponent,
  private fb : FormBuilder,
  private _usersService:UsersService,
  private _dialogRef                    : DialogRef<any>
) {

  this.mensaje = data.mensaje
}

  onClose(){
    this._dialogRef.close();
    }

   ngOnInit(){
    this._usersService.getRoles({
      estado: 1,
      pageNum: 1,
      pageSize: 20
    }).subscribe(response =>{
      this.opciones = response.data.list;
    })
   }
}
