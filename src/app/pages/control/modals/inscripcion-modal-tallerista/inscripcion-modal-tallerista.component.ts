import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { RolData } from '@models/rol/rol-data.model';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { UsersService } from '@services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ControlAptosService } from 'src/app/data/services/control/control-aptos.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { InscripcionModalComponent } from '../inscripcion-modal/inscripcion-modal.component';
import { InscripcionTalleristaControlService } from 'src/app/events/control/inscripcion-tallerista-control.service';

@Component({
  selector: 'esp-inscripcion-modal-tallerista',
  templateUrl: './inscripcion-modal-tallerista.component.html',
  styleUrls: ['./inscripcion-modal-tallerista.component.scss']
})
export class InscripcionModalTalleristaComponent {

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
  conConexion! : boolean;
  acreditado!: boolean;

  idControlAsistenciaDet!: number;


  public form = this.fb.nonNullable.group({
    frmTipoDoc: ['1', [Validators.required]],
    frmNumdoc: ['', [Validators.required]],
  });

  
  opciones: Parametro[] = [];

  

  columnWidths: string = '50% 50% 0%';
  
  constructor(private _dialogRef: DialogRef<InscripcionModalComponent>,
    @Inject(DIALOG_DATA) public data: any,
    private rolesService: RolService,
    private datosService: DatosGeneralesService,
    private fb: FormBuilder,
  private inscripcionService: ControlAptosService,
  private controlProgramacionService : ControlProgramacionService,
  private toastrService: ToastrService,
  private eventService: InscripcionTalleristaControlService
){

    this.idControlAsistenciaDet = data.idControlAsistenciaDet
  }

  ngOnInit(): void {
    this.form.get('frmTipoDoc')!.valueChanges.subscribe(value => {
      this.setDocumentValidators(value);
    })
    this.getParametros();
  }

  setDocumentValidators(documentType: string) {
    const documentNumberControl = this.form.get('frmNumdoc')!;
    if (documentType === '1') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]);
    } else if (documentType === '4') {
      documentNumberControl.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{9}$/)
      ]);
    }
    else if (documentType === '23') { // Suponiendo que 'X' es el tipo de documento para el permiso temporal de permanencia
    documentNumberControl.setValidators([
      Validators.required,
      Validators.pattern(/^\d{9}$/) // Ajusta el patrón según el formato del permiso temporal de permanencia
    ]);
  } else if (documentType === '7') { // Suponiendo que 'P' es el tipo de documento para el pasaporte
    documentNumberControl.setValidators([
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{9}$/) // Ajusta el patrón según el formato del pasaporte
    ]);
  }
    else {
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
        if(data.code == 0){
          if(data.data.length > 0){
            this.statusLoadContacto = true;
            //console.log(data);
            this.srcAsegurado = data.data[0].foto;
            this.nombreContacto = data.data[0].nombreCompleto;
            this.numdocContacto = data.data[0].numDoc;
            this.acreditado = data.data[0].acreditacion;
            this.idAsegurado = data.data[0].idFichaAsegurado;
            this.conConexion = data.code == 0 ? true : false;
            this.columnWidths = "50% 44% 4%";
          }
          else{
            this.toastrService.warning("La persona buscada no existe en la lista de contactos")
          }
        }
        else{
          this.toastrService.warning(data.message)
        }
      })
    }
   
  }

  resetColumnWidths(){
    this.columnWidths = "50% 50% 0%";
  }

  limpiarDatos(){
    this.form.patchValue({
      frmTipoDoc : "1",
      frmNumdoc: ""
    })
    this.form.markAsUntouched();
    this.statusLoadContacto = false;
  }

  registrar(){

    this.controlProgramacionService.registerAseguradoDetalle({
      idFichaAdmision: parseInt(this.idAsegurado),
      idControlAsistenciaDet: this.idControlAsistenciaDet,
      acreditado: this.acreditado,
      conConexion: this.conConexion
    }).subscribe(data => {
      if(data.code == "0"){
        this.eventService.emitirEvento(data.data.idControlAsistenciaSubDet)

        this.toastrService.success("Registro Exitoso");
        this.limpiarDatos();
      }
      else{
        this.toastrService.warning(data.message);
      }
    })
 
  }

  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      //console.log(data);
      this.opciones = data.data;
    });
  }
}
