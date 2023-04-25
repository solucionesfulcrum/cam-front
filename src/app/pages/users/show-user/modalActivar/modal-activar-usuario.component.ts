import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  guiid: string;
  status: RequestStatus = 'init';
  durationEnSegundos = 10;

  form = this.formBuilder.group({
    rol: ['', [Validators.required]],
    observaciones: ['', [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<ModalActivarUsuarioComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private snackBar2: MatSnackBar
  ) {
    this.loadRoles();
  }

  ngOnInit(): void {}

  async activaUsuarioYAsignaRoles() {
    if (this.form.valid) {
      this.status = 'loading';
      await this.activarUsuario();
      await this.asignarRoles();
      this.dialogRef.close({
        data: {
          message: 'exito despues de cerrar',
        },
        disableClose: false,
      });
    }
  }

  async activarUsuario() {
    let { fechaInicio, fechaFin, observaciones } = this.form.getRawValue();
    fechaInicio = moment(fechaInicio).format('DD/MM/YYYY');
    fechaFin = moment(fechaFin).format('DD/MM/YYYY');
    const rules = [this.form.controls.rol.value];
    this.authService
      .registrarVigenciaFromSSO(
        this.data.guiid,
        fechaInicio,
        fechaFin,
        observaciones!
      )
      .subscribe((rta: any) => {
        console.log('rta for vigencia: ', rta);
        rta = JSON.parse(rta as string);
        this.snackBar.open('Registro de vigencia - ' + rta.message, 'Cerrar', {
          duration: this.durationEnSegundos * 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackCyan'],
        });
        this.status = 'success';
      });
  }

  async asignarRoles() {
    const rules = [this.form.controls.rol.value!];
    this.authService
      .asignarRolesForUsuarioFromSSO(this.data.guiid, rules)
      .subscribe((rta: any) => {
        let msg = '';
        if (rta === 'true') msg = 'se realizó correctamente';
        else msg = 'no se pudo realizar';

        this.snackBar2.open('Asignación de roles - ' + msg, 'Cerrar', {
          duration: this.durationEnSegundos * 1000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackSky'],
        });
        this.status = 'success';
      });
  }

  loadRoles() {
    this.authService.getRolesFromSSO(1, 20).subscribe((rta: any) => {
      const newrta = JSON.parse(rta as string);
      this.roles = newrta.list;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
