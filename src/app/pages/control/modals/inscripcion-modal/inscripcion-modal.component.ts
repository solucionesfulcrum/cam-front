import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestStatus } from '@models/request-status.model';
import { RolData } from '@models/rol/rol-data.model';
import { ActivateUserSSO, ActivateUserSigps } from '@models/usuario/user.model';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { UsersService } from '@services/users.service';
import { startWith, map } from 'rxjs';
import { ControlAptosService } from 'src/app/data/services/control/control-aptos.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

@Component({
  selector: 'esp-inscripcion-modal',
  templateUrl: './inscripcion-modal.component.html',
  styleUrls: ['./inscripcion-modal.component.scss']
})
export class InscripcionModalComponent {

  minDate = new Date();
  listRoles: RolData[] = [];
  status: RequestStatus = 'init';
  // frmCtrlRol = new FormControl();
  // rolSeleccionadoTmp!: RolData;
  idUser: any;
  listUnidadOperativa: any[] = [];
  frmNombre = new FormControl();
  unidOperaSeleccionadaTmp!: any;

  showMsg = false;
  idUserSession: any;
  userData = Object();

  srcAsegurado = "";
  statusLoadContacto = false;
  nombreContacto = "";
  numdocContacto = "";

  public formVigencia = this.fb.nonNullable.group({
    frmInicioVigencia: [null, [Validators.required]],
    frmFinVigencia: [null, [Validators.required]],
  });

  public formDatosAdicionales = this.fb.nonNullable.group({
    frmTipoDoc: ['', [Validators.required]],
  });

  columnWidths: string = '50% 50% 0%';
  
  constructor(private _dialogRef: DialogRef<InscripcionModalComponent>,
    @Inject(DIALOG_DATA) public data: any,
    private rolesService: RolService,
    private _notification: NotificationService,
    private datosService: DatosGeneralesService,
    private userService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  private inscripcionService: ControlAptosService){
  }

  ngOnInit(): void {
   /* if (localStorage.getItem('camUser') != 'null') {
      this.idUserSession = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
    }
    else {
      this.idUserSession = '1';
    }
    this.formVigencia.controls.frmInicioVigencia.valueChanges.subscribe((data) => {
      const dataStr = String(data)
      this.minDate = new Date(parseInt(dataStr.split('/')[2]), parseInt(dataStr.split('/')[1]) - 1, parseInt(dataStr.split('/')[0]))
    })
    this.formDatosAdicionales.get('frmRol')!.valueChanges.subscribe(selectedRoleId => {
      this.frmCtrlUnidadOperativa.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.nombre)).subscribe((data) => {
        let idRolNum = parseInt(selectedRoleId);
        this.datosService.getUnidadesOperativasRol(data, idRolNum).subscribe((datos) => {
          this.listUnidadOperativa = datos.data;
        })
      })
      this.frmCtrlUnidadOperativa.setValue('')
    });


    this.cargaServiciosParametros();
    // this.formVigencia.controls.frmInicioVigencia.disable()
    // this.formVigencia.controls.frmFinVigencia.disable()
    this.userData = this.data.user;
    this.frmCtrlUnidadOperativa.addValidators([Validators.required])*/
    //console.log("local");
    //console.log(localStorage);
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
    if (input == '') {
      input = null;
    }
    switch (opt) {
      case 1:
        this.formVigencia.controls.frmInicioVigencia.setValue(input)
        break;
      case 2:
        this.formVigencia.controls.frmFinVigencia.setValue(input)
        break;
    }
  }

 

  getActivacionSIGPS(): ActivateUserSigps {
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;

    return {
      usuarioId: Number(localStorage.getItem("userId")),
      rolId: parseInt(this.formDatosAdicionales.value.frmTipoDoc!),
      fechInicio: "123",
      fechFin:  "123",
      unidOperativaId: this.unidOperaSeleccionadaTmp,
      usuarioRegId: this.idUserSession
    }
  }

  saveActivacion() {
    if (this.validForm()) {
      // console.log(this.getActivacionSIGPS())
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
      this.frmNombre.markAllAsTouched()
    }
  }

  validForm(): boolean {
    if (this.frmNombre.valid && this.formDatosAdicionales.valid){
      
      this.showMsg = true;
      
      return true;
    }
    else {
      this.showMsg = true;
      return false;
    }
  }

  getFilaStyle() {
    return {
      width: this.statusLoadContacto ? '80%' : '100%'
    };
  }

  
  //06077426 TEST
  buscarInscripcion(){
    //this.saveActivacion();
    
    this.status = 'loading';
    this.inscripcionService.buscarApto(
      /*(JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
      this.frmNombre.value,
      this.formDatosAdicionales.get("frmTipoDoc")!.value,*/
      38,
      1,
      '08290906'
    )
    .subscribe(data => {
      this.status = 'success';
      this.statusLoadContacto = true;
      console.log(data);
      this.srcAsegurado = data.data[0].foto;
      this.nombreContacto = data.data[0].nombreCompleto;
      this.numdocContacto = data.data[0].numDoc;
      this.columnWidths = "50% 44% 6%";
    })
  }

  resetColumnWidths(){
    this.columnWidths = "50% 50% 0%";
  }

  limpiarDatos(){
    this.statusLoadContacto = false;
  }

  registrar(){
    alert("en desarrollo");
  }

}
