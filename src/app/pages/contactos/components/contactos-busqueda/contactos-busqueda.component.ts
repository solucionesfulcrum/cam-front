import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestStatus } from '@models/request-status.model';
import { RolData } from '@models/rol/rol-data.model';
import { NotificationService } from '@services/notification.service';
import { RolService } from '@services/rol.service';
import { UsersService } from '@services/users.service';
import { ToastrService } from 'ngx-toastr';
import { AfiliadoService } from 'src/app/data/services/afiliaciones/afiliado.service';
import { ControlAptosService } from 'src/app/data/services/control/control-aptos.service';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { InscripcionModalComponent } from 'src/app/pages/control/modals/inscripcion-modal/inscripcion-modal.component';

@Component({
  selector: 'esp-contactos-busqueda',
  templateUrl: './contactos-busqueda.component.html',
  styleUrls: ['./contactos-busqueda.component.scss']
})
export class ContactosBusquedaComponent {

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


  public form = this.fb.nonNullable.group({
    frmTipoDoc: ['1', [Validators.required]],
    frmNumdoc: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
  });

  
  opciones: Parametro[] = [];

  

  columnWidths: string = '50% 50% 0%';
  
  constructor(
    private rolesService: RolService,
    private _notification: NotificationService,
    private datosService: DatosGeneralesService,
    private userService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private afiliadoServ: AfiliadoService,
  private controlProgramacionService : ControlProgramacionService,
  private toastrService: ToastrService){

    
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
      //  Validators.pattern(/^[a-zA-Z0-9]{9}$/)
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
      this.afiliadoServ.getAfiliadoByTipoDoc(
        this.form.get("frmTipoDoc")!.value,
        this.form.get("frmNumdoc")!.value,
      )
      .subscribe(data => {
        this.status = 'success';
        if(data.code == 0){
          this.router.navigate(['/app/contactos/busqueda/'+data.data.idFichaAdmision],
            {
              state: {
                esConsulta: true
              }
            }
          )
        }
        else{
          this.toastrService.warning(data.message)
        }
      })
    }
   
  }


  getParametros(){
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) =>{
      //console.log(data);
      this.opciones = data.data;
    });
  }
}
