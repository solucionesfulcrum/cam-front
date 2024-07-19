import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Parametro } from '@models/parametros-busqueda.model';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { UsersService } from '@services/users.service';
import { ModalAlertComponent } from '@shared/components/modal-alert/modal-alert.component';
import { ToastrService } from 'ngx-toastr';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
const helperJWT = new JwtHelperService();

@Component({
  selector: 'esp-asignar-rol-modal',
  templateUrl: './asignar-rol-modal.component.html',
  styleUrls: ['./asignar-rol-modal.component.scss']
})
export class AsignarRolModalComponent {

  userInfo = Object();

  rolCam : any= {
    "SUPER-ADMIN" : 'ADMIN',
    "CAM" : 'CAM',
    "USER" : 'CAM',
  }


  mensaje: string = "";
  faClose = faClose
  statusLoadContacto: boolean = true;

  statusLogin: string = '';
  msg: string = '';

  opciones: any[] = [];
  showPassword: boolean = false;
  guuid: string = '';

  user: any = Object();
  idUser: string = "";

  public form = this.fb.nonNullable.group({
    rol: ['USER', [Validators.required]],
    numdoc: [''],
    password: ['', [Validators.required]],
  });


  
  constructor(@Inject(MAT_DIALOG_DATA) public data: AsignarRolModalComponent,
  private fb : FormBuilder,
  private usersService:UsersService,
  
  private _dialogRef                    : DialogRef<any>,
  private datosService: DatosGeneralesService,
  private authService: AuthService,
  private tokenService: TokenService,
  private toast: ToastrService
) {

  this.user = data.user
  this.idUser = data.idUser;
}

  onClose(){
    this._dialogRef.close();
    }

    guardarRol(){

    }

   ngOnInit(){
    this.usersService.getRoles({
      estado: 1,
      pageNum: 1,
      pageSize: 20
    }).subscribe(response =>{
      this.opciones = response.data.list;
    })
   
   }


  
  asignarRol(){
    if (this.form.valid) {
      this.statusLogin = 'loading';
      const { username, password } = {username : String(this.tokenService.getUsername()), password: this.form.get('password')!.value};
      this.authService.login(username, password).subscribe({
        next: async (rta) => {
          this.statusLogin = 'success';
          this.usersService.asignarRolSSO({
            token: String(this.tokenService.getToken()),
            guiid: this.user.guiid,
            roles: [
              this.form.get('rol')!.value
            ]
          }).subscribe((data) => {
            if(data.code == 0){
              this.usersService.asignarRolCAM({
                idUsuario: this.idUser,
                rol: this.rolCam[this.form.get('rol')!.value as any]
              }).subscribe(response =>{
                if(response.code == 0){
                  this.toast.success(response.message);
                  this._dialogRef.close({
                    data: {
                      ok: true
                    }
                  });
                }
                else{
                  this.msg = response.message
                }
              })
            }
            else{
              this.msg = data.message
            }
          })
        },
        error: (rta) => {
          //this._notification.error(rta.message)
          this.statusLogin = 'failed';
          this.authService.getSSOMessage.subscribe(msg=>{
            this.msg = msg;
          })
          //this.msgSSO ='Credenciales inválidas.'
          if ( rta?.statusText === 'Bad credentials')
            this.msg = 'Credenciales incorrectas'
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  
}
