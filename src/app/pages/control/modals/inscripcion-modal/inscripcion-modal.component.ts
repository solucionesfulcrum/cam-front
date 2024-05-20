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
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs';
import { ControlAptosService } from 'src/app/data/services/control/control-aptos.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
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
  frmNombre = new FormControl('',[
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]);
  unidOperaSeleccionadaTmp!: any;

  showMsg = false;
  idUserSession: any;
  userData = Object();

  srcAsegurado = "";
  statusLoadContacto = false;
  nombreContacto = "";
  numdocContacto = "";
  idAsegurado = "";


  public form = this.fb.nonNullable.group({
    frmTipoDoc: ['', [Validators.required]],
    frmNumdoc: ['', [Validators.required]],
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
  private inscripcionService: ControlAptosService,
  private controlProgramacionService : ControlProgramacionService,
  private toastrService: ToastrService){

    
  }

  

  ngOnInit(): void {
    this.form.get('frmTipoDoc')!.valueChanges.subscribe(value => {
      this.setDocumentValidators(value);
    })
  }

  setDocumentValidators(documentType: string) {
    const documentNumberControl = this.form.get('frmNumdoc')!;
    if (documentType === '1') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]);
    } else if (documentType === '2') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{9}$/)
      ]);
    } else {
      documentNumberControl.setValidators(Validators.required);
    }
    documentNumberControl.updateValueAndValidity();
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
  
  markAllAsTouchedAndDirty() {
    this.form.markAllAsTouched(); // Marca todos los controles como tocados
    Object.values(this.form.controls).forEach(control => {
      control.markAsDirty(); // Marca cada control como sucio
    });
  }

 


//05110811
  //06077426 TEST
  buscarInscripcion(){
    this.markAllAsTouchedAndDirty();
    if(this.form.valid){
      this.status = 'loading';
      this.inscripcionService.buscarApto(
        (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa,
        this.form.get("frmTipoDoc")!.value,
        this.form.get("frmNumdoc")!.value,
      )
      .subscribe(data => {
        this.status = 'success';
        if(data.data.length > 0){
          this.statusLoadContacto = true;
          console.log(data);
          this.srcAsegurado = data.data[0].foto;
          this.nombreContacto = data.data[0].nombreCompleto;
          this.idAsegurado = data.data[0].idFichaAsegurado;
          this.columnWidths = "50% 44% 6%";
        }
        else{
          this.toastrService.warning("La persona buscada no existe en la lista de contactos")
        }
      })
    }
   
  }

  resetColumnWidths(){
    this.columnWidths = "50% 50% 0%";
  }

  limpiarDatos(){
    this.form.patchValue({
      frmTipoDoc : "",
      frmNumdoc: ""
    })
    this.form.markAsUntouched();
    this.statusLoadContacto = false;
  }

  registrar(){
    /*
     idFichaAdmision: string,
    idUnidadOperativa: string,
    idProgramacionDet: string,
    acreditado: boolean,
    idUsuarioReg: string
    */
    let unidadOperativa : string = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
    let selectedProgramacion : string = String(localStorage.getItem('idProgramElegida'));
    this.controlProgramacionService.registrarInscripcion({
      idFichaAdmision: "2",
      idUnidadOperativa: unidadOperativa,
      idProgramacionDet: selectedProgramacion,
      acreditado: false,
      idUsuarioReg: "1"
    }).subscribe(data => {
      console.log(data);
    })
 
  }

}
