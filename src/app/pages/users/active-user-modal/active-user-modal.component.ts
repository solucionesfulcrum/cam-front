import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RequestStatus } from '@models/request-status.model';
import { RolData } from '@models/rol/rol-data.model';
import { ActivateUserSSO, ActivateUserSigps } from '@models/usuario/user.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { UsersService } from '@services/users.service';
import { SharedModule } from '@shared/shared.module';
import { map, startWith } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'esp-active-user-modal',
  templateUrl: './active-user-modal.component.html',
  styleUrls: ['./active-user-modal.component.scss']
})
export class ActiveUserModalComponent {

  minDate = new Date();
  listRoles: RolData[] = [];
  status: RequestStatus = 'init';
  // frmCtrlRol = new FormControl();
  // rolSeleccionadoTmp!: RolData;
  idUser: any;
  listUnidadOperativa: any[] = [];
  frmCtrlUnidadOperativa = new FormControl();
  unidOperaSeleccionadaTmp!: any;

  showMsg = false;
  idUserSession: any;
  userData = Object();

  public formVigencia = this.fb.nonNullable.group({
    frmInicioVigencia: [null],
    frmFinVigencia: [null],
  });

  public formDatosAdicionales = this.fb.nonNullable.group({
    frmRol: ['', [Validators.required]],
    frmMotivo: [null, [Validators.required]],
  });

  constructor(private _dialogRef: DialogRef<ActiveUserModalComponent>,
    @Inject(DIALOG_DATA) public data: any,
    private rolesService: RolService,
    private datePipe: DatePipe,
    private _notification: NotificationService,
    private datosService: DatosGeneralesService,
    private userService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    if (localStorage.getItem('camUser') != 'null') {
      this.idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
    }
    else {
      this.idUserSession = '1';
    }
    this.formVigencia.controls.frmInicioVigencia.valueChanges.subscribe((data) => {
      const dataStr = String(data)
      this.minDate = new Date(parseInt(dataStr.split('/')[2]), parseInt(dataStr.split('/')[1]) - 1, parseInt(dataStr.split('/')[0]))
    })
    this.frmCtrlUnidadOperativa.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.nombre)).subscribe((data) => {

      this.datosService.getUnidadesOperativas(data).subscribe((datos) => {
        this.listUnidadOperativa = datos.data;
      })
    })
    this.frmCtrlUnidadOperativa.setValue('')


    this.cargaServiciosParametros();
    // this.formVigencia.controls.frmInicioVigencia.disable()
    // this.formVigencia.controls.frmFinVigencia.disable()
    this.userData = this.data.user;
    this.frmCtrlUnidadOperativa.addValidators([Validators.required])
  }

  cargaServiciosParametros() {
    this.rolesService.getListRolesActivos().subscribe((data) => {

      this.listRoles = data.data;
    })
  }

  //Unidad Operativa --------------------------------------------------------------------------------------------------------------------------------------------------

  displayFnUnidadOperativa(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  onSelectionChangeUnidadOperativa(event: any) {

    this.unidOperaSeleccionadaTmp = event.option.value.idUnidadOperativa;
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

  onClose() {
    this._dialogRef.close();
  }

  actualizarDate(input: any, opt: number) {
    switch (opt) {
      case 1:
        this.formVigencia.controls.frmInicioVigencia.setValue(input)
        break;
      case 2:
        this.formVigencia.controls.frmFinVigencia.setValue(input)
        break;
    }
  }

  getActivacionSSO(): ActivateUserSSO {
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;

    return {
      guiid: this.data.user.guiid,
      fechaInicio: this.datePipe.transform(fechaInicio!.split('/')[2] + '/' + fechaInicio!.split('/')[1] + '/' + fechaInicio!.split('/')[0], 'dd/MM/yyyy')!,
      fechaFin: this.datePipe.transform(fechaFin!.split('/')[2] + '/' + fechaFin!.split('/')[1] + '/' + fechaFin!.split('/')[0], 'dd/MM/yyyy')!,
      observacion: this.formDatosAdicionales.value.frmMotivo!
    }
  }

  getActivacionSIGPS(): ActivateUserSigps {
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;

    return {
      usuarioId: Number(localStorage.getItem("userId")),
      rolId: parseInt(this.formDatosAdicionales.value.frmRol!),
      fechInicio: this.datePipe.transform(fechaInicio!.split('/')[2] + '/' + fechaInicio!.split('/')[1] + '/' + fechaInicio!.split('/')[0], 'yyyy-MM-dd')!,
      fechFin: this.datePipe.transform(fechaFin!.split('/')[2] + '/' + fechaFin!.split('/')[1] + '/' + fechaFin!.split('/')[0], 'yyyy-MM-dd')!,
      unidOperativaId: this.unidOperaSeleccionadaTmp,
      usuarioRegId: this.idUserSession
    }
  }

  saveActivacion() {
    if (this.validForm()) {
      this.status = 'loading';
      this.userService.activateUserSigps(this.getActivacionSIGPS()).subscribe((data) => {
        this._notification.success('Se ha activado correctamente');
        this.status = 'success';
        this._dialogRef.close();
      })
    }
    else {
      this.formDatosAdicionales.markAllAsTouched();
      this.formVigencia.markAllAsTouched();
      this.frmCtrlUnidadOperativa.markAllAsTouched()
    }
  }

  validForm(): boolean {
    if (this.formDatosAdicionales.valid && this.formVigencia.value.frmInicioVigencia != null && this.formVigencia.value.frmFinVigencia != null && this.frmCtrlUnidadOperativa.valid)
      return true;
    else {
      this.showMsg = true;
      return false;
    }
  }

}
