import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { AuthService } from 'src/app/pages/auth/services/auth-service.service';

@Component({
  selector: 'app-modal-activar-usuario',
  templateUrl: './modal-activar-usuario.component.html',
  styleUrls: ['./modal-activar-usuario.component.css'],
})
export class ModalActivarUsuarioComponent implements OnInit {

roles: any;
status: RequestStatus= 'init';

form = this.formBuilder.group({
    rol: ['', [ Validators.required ]],
    observaciones: ['', [ Validators.required ]],
    fechaInicio: ['', [ Validators.required ]],
    fechaFin: ['', [ Validators.required ]],
})



  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalActivarUsuarioComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadRoles()
  }

  ngOnInit(): void {}

  activaUsuarioYAsignaRoles(){
    this.status = 'loading';
    this.activarUsuario()
  }

  async activarUsuario(){
  let {fechaInicio, fechaFin, observaciones } = this.form.getRawValue()
  fechaInicio =  moment(fechaInicio).format('DD-MM-YYYY')
  fechaFin =  moment(fechaFin).format('DD-MM-YYYY') 
  const rules = [this.form.controls.rol.value]
  this.authService.registrarVigenciaFromSSO(fechaInicio, fechaFin, observaciones!).subscribe((rta)=>{
    this.asignarRoles()
  })
  }

  async asignarRoles(){
    const rules = [this.form.controls.rol.value!]
    this.authService.asignarRolesForUsuarioFromSSO(rules).subscribe((rta)=>{
      this.status = 'success';
       this.dialogRef.close( {
      data: {
        message: 'exito despues de cerrar',
      },
      disableClose: false,
    })
    })
  }
  
 loadRoles(){
    this.authService.getRolesFromSSO(1,20)
    .subscribe((rta:any) =>{
      const newrta = JSON.parse(rta as string);
      this.roles = newrta.list
    })
 }

 onNoClick(): void {
    this.dialogRef.close();
  }

}