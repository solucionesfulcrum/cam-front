import { Component, VERSION, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  faCheck,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
  faSquareCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomValidators } from 'src/app/utils/validators';
import { ButtonComponent } from 'src/app/shared/components/btn/button.component';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { InvalidTokenError } from 'jwt-decode';
import { Dialog } from '@angular/cdk/dialog';
import { DialogCodigoActivacionComponent } from '../dialog-codigo-activacion/dialog-codigo-activacion.component';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { RequestRegisterSIGPS } from '@models/auth/register.model';
import { NotificationService } from '@services/notification.service';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  @ViewChild('cdkStepper')
  cdkStepper!: CdkStepper;

  listParamDoc: Parametro[] = [];
  listUnidadOperativa: any[] = [];
  isFinish: boolean = false
  isPreRegister: boolean = false
  msgError!: string;
  msgErrorTerminos!: string;
  msgErrorPassWord!: string;

  formCodeEmail = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required]],
  });

  form = this.formBuilder.nonNullable.group(
    {
      tipoDoc: ['', [Validators.required]],
      doc: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.minLength(8), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      names: ['', [Validators.required]],
      codigoPlanilla: [''],
      confirmPassword: ['', [Validators.required]],
      //frmCtrlUnidadOperativa: ['', [Validators.required]],
      terminos: [false, [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('password', 'confirmPassword'),
      ],
    }
  );

  showMsg = false;
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faMagnifyingGlass = faMagnifyingGlass;
  faSquareCheck = faSquareCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCheck = faCheck;
  showPassword = false;
  showConfirmPassword = false;
  showRegister = false;
  emailCode!: string;
  nameUserRegister!: string;
  genWithCode!: string;
  frmCtrlUnidadOperativa = new FormControl();
  unidOperaSeleccionadaTmp!: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private datosService: DatosGeneralesService,
    private dialog: Dialog,
  ) { }

  ngOnInit(): void {
    // this.toastr.success('hola');
    this.getParametros();
    this.form.controls.doc.valueChanges.subscribe(val => {
      this.form.controls.doc.setValue(val.trim(), { emitEvent: false })
    })

    this.frmCtrlUnidadOperativa.valueChanges.pipe(startWith(''), map(value => typeof value === 'string' ? value : value.nombre)).subscribe((data) => {
     
      this.datosService.getUnidadesOperativas(data).subscribe((datos) => {
        this.listUnidadOperativa = datos.data;
      })
    })
    this.frmCtrlUnidadOperativa.setValue('')
    this.frmCtrlUnidadOperativa.addValidators([Validators.required])
  }
  //Unidad Operativa --------------------------------------------------------------------------------------------------------------------------------------------------

  displayFnUnidadOperativa(selectedoption: any) {
    return selectedoption ? selectedoption.nombre : undefined;
  }

  onSelectionChangeUnidadOperativa(event: any) {

    this.unidOperaSeleccionadaTmp = event.option.value.idUnidadOperativa;
  }

  getParametros() {
    this.datosService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data) => {
      this.listParamDoc = data.data;
    });
    /*this.listParamDoc = [{idParametros:1,tipo:"algun",activo:true,descripcion:'DNI',fechaModificacion:"",fechaRegistro:"",idPradre:1,nombre:"Documento Nacional de Indentidad",valor1:"1",valor2:"01"},
    {idParametros:1,tipo:"algun",activo:true,descripcion:'DNI',fechaModificacion:"",fechaRegistro:"",idPradre:1,nombre:"Carnet de Extrangeria",valor1:"2",valor2:"01"}];
    */
    /*this.datosService.getUnidadesOperativas('').subscribe((data) => {
      this.listUnidadOperativa = data.data;
      console.log("lista de unidaddes operativas", this.listUnidadOperativa)
    });*/
  }

  register() {
    this.msgErrorTerminos = ''
    this.msgErrorPassWord = ''
    if (this.form.valid && this.frmCtrlUnidadOperativa.valid) {
      if (this.form.value.terminos != true) {
        this.msgErrorTerminos = 'Debe Ud. Aceptar los terminos y condiciones'
      } else {

        this.status = 'loading';
        const { tipoDoc, doc, names, email, password, codigoPlanilla } =
          this.form.getRawValue();
        //this.authService.register(name, email, password)
        this.authService
          .register(tipoDoc, doc, names, email, password, codigoPlanilla)
          .subscribe({
            next: (rta: any) => {
              if (rta.code == 0) {
                var resError = true;
                try {
                  var result = JSON.parse(rta.data);
                } catch (error) {
                  resError = false;
                }
                if (resError) {
                  this.msgError = result.message;
                  this.msgError = this.msgError[0].toUpperCase() + this.msgError.substr(1).toLowerCase();
                  this.status = 'failed';
                }
                else {
                  this.status = 'success';
                  this.emailCode = email;
                  this.nameUserRegister = names;
                  this.genWithCode = rta.data;
                  this.isPreRegister = true
                  this.authService.registerSIGPS(this.getModelRequestRegisterSigps(this.genWithCode)).subscribe((data) => {
                    if (data.code == 0) {
                      this.showDialogEmailCode();
                    }
                  })
                }
              } else {
                this.msgError = rta.message;
                this.status = 'failed';
              }
            },
            error: (rta) => {
              this.isPreRegister = false
              this.status = 'failed';
            },
          });
      }

    } else if (this.form.value.password != this.form.value.confirmPassword) {
      this.msgErrorPassWord = 'Las contraseñas son distintas'
    } else {
      this.form.markAllAsTouched();
      this.frmCtrlUnidadOperativa.markAllAsTouched();
    }
  }

  getModelRequestRegisterSigps(guiidSso: string): RequestRegisterSIGPS {
    return {
      correo: this.form.value.email!,
      categoria: 'CAM',
      tipoDoc: this.form.value.tipoDoc!,
      numDoc: this.form.value.doc!,
      nombres: this.form.value.names!.toUpperCase(),
      codPlanilla: this.form.value.codigoPlanilla!,
      unidOperativaId: this.unidOperaSeleccionadaTmp,
      guiidSso: guiidSso
    }
  }

  showDialogEmailCode() {
    const dialogRef = this.dialog.open(DialogCodigoActivacionComponent, {
      minWidth: '520px',
      maxWidth: '40%',
      disableClose: true,
      data: {
        numDoc: this.form.value.doc,
        genWithCode: this.genWithCode,
        correo: this.form.value.email
      }
    })
    dialogRef.closed.subscribe(out => {
      // console.log(out)
    })
  }

  validateAll() {
    this.cdkStepper.next();
  }

  /*validateCodeEmail() {
    if (this.formCodeEmail.valid) {
      this.status = 'loading';
      const { code } = this.formCodeEmail.getRawValue();
      this.authService.validateCode(code, this.genWithCode, this.numdoc).subscribe({
        next: (rta) => {
          console.log('next for validate code: ', rta);
          if (rta.data === 'true') {
            this.status = 'success';
            this.cdkStepper.next();
            this.isFinish= true
          } else {
            //this.formCodeEmail.controls.code.setValue("")
            this.isFinish=false 
            this.formCodeEmail.setErrors({'invalid':true})
            this.status = 'failed';
          }
        },
        error: (rta) => {
          console.log('error for validate code: ', rta);
          this.status = 'failed';
        },
      });
    } else {
      this.form.markAsTouched;
    }
  }*/
  sendRegister() {

  }

  validForm(): boolean {
    if (this.frmCtrlUnidadOperativa.valid)
      return true;
    else {
      this.showMsg = true;
      return false;
    }
  }
}

//this.router.navigate(['/login'], {
//              queryParams: { code},
//            });
//  this.form.controls.email.setValue(code);
