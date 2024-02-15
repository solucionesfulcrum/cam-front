import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RolData } from '@models/rol/rol-data/rol-data.module';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { AuthService } from 'src/app/pages/auth/services/auth-service.service';
import { UsuarioService } from '../../../../core/_service/usuario.service'
import { map, startWith } from 'rxjs';
import { ActivateUser } from '../../../../models/usuario/user/user.module'
import { DatePipe } from '@angular/common';
import { ActivatedRoute,Params ,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-activar-usuario',
  templateUrl: './modal-activar-usuario.component.html',
  styleUrls: ['./modal-activar-usuario.component.css'],
})
export class ModalActivarUsuarioComponent implements OnInit {
  public formDatosAdicionales = this.formBuilder.nonNullable.group({
    frmRol: ['', [Validators.required]],
    frmMotivo: [null, [Validators.required]],
  });

  public formVigencia = this.formBuilder.nonNullable.group({
    frmInicioVigencia: [null],
    frmFinVigencia: [null],
  });
  frmCtrlUnidadOperativa = new FormControl();
  listRoles: RolData[] = [];
  listUnidadOperativa: any[] = [];
  unidOperaSeleccionadaTmp!: any;
  id : number;
  idUserSession: any;
  minDate = new Date();
  showMsg = false;
  roles: any;
  guiid: string;
  status: RequestStatus = 'init';
  durationEnSegundos = 10;
  urlTree: any

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
    private snackBar2: MatSnackBar,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
   
  }

  ngOnInit(): void {
    this.id = Number(localStorage.getItem("userId"))
    console.log("idddddddddd",this.id)
    if(localStorage.getItem('dataLog') != 'null'){
      this.idUserSession = (JSON.parse(localStorage.getItem('dataLog')!)).idUserApp;
    }
    else{
      this.idUserSession = '1';
    }
    this.formVigencia.controls.frmInicioVigencia.valueChanges.subscribe((data) => {
      const dataStr = String(data)
      this.minDate = new Date(parseInt(dataStr.split('/')[2]), parseInt(dataStr.split('/')[1]) - 1, parseInt(dataStr.split('/')[0]))
    })
    this.frmCtrlUnidadOperativa.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.descripcionCompleta)).subscribe((data) => {
      this.usuarioService.getUnidadesOperativas().subscribe((datos) => {
        this.listUnidadOperativa = datos.data;
      })
    })
    this.frmCtrlUnidadOperativa.setValue('')
    this.cargaServiciosParametros();
    console.log('roles...........', this.listRoles)
  }

  cargaServiciosParametros() {
    this.usuarioService.getListRolesActivos().subscribe((data) => {
      this.listRoles = data.data;
    })
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
    // console.log(input)
  }

  getActivacion(): ActivateUser{
    let fechaInicio: string, fechaFin: string;
    fechaInicio = this.formVigencia.value.frmInicioVigencia!;
    fechaFin = this.formVigencia.value.frmFinVigencia!;

    return {
      usuarioId: this.id,
      rolId: parseInt(this.formDatosAdicionales.value.frmRol!),
      fechInicio: this.datePipe.transform(fechaInicio!.split('/')[2]+'/'+fechaInicio!.split('/')[1]+'/'+fechaInicio!.split('/')[0], 'yyyy-MM-dd')!,
      fechFin: this.datePipe.transform(fechaFin!.split('/')[2]+'/'+fechaFin!.split('/')[1]+'/'+fechaFin!.split('/')[0], 'yyyy-MM-dd')!,
      unidOperativaId: 1,
      //unidOperativaId: this.frmCtrlUnidadOperativa.value.idUnidOperativa,
      usuarioRegId: this.idUserSession
    }
  }
  displayFnUnidadOperativa(selectedoption: any) {
    return selectedoption ? selectedoption.descripcionCompleta : undefined;
  }
  onSelectionChangeUnidadOperativa(event: any) {
    this.unidOperaSeleccionadaTmp = event.option.value;
  }
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

  onClose() {
    this.dialogRef.close();
  }

  saveActivacion() {
    console.log("Guardar Activación")
    console.log(this.getActivacion())
    
    //if(this.validForm()){
      this.status = 'loading';
      this.usuarioService.activateUser(this.getActivacion()).subscribe((data)=>{
        console.log(data)
        this.dialogRef.close();
        this.toastrService.success("Mensaje: Unidad Operativa Activada");
        //this.cargaServiciosParametros();
        /*if(data){
          if(typeof data === 'object'){
              this.status = 'failed';
            this._notification.warning(data.message);
            // console.log(data.message)
          }
          else{
            this.userService.activateUserSigps(this.getActivacionSIGPS()).subscribe((data)=>{
              this._notification.success('Se ha activado correctamente');
              this.status = 'success';
              // console.log(data)
              this._dialogRef.close();
            })
          }
        }*/
      })
    //}
    /*else{
      this.formDatosAdicionales.markAllAsTouched();
      this.formVigencia.markAllAsTouched();
      this.frmCtrlUnidadOperativa.markAllAsTouched()
    }*/
  }
}
