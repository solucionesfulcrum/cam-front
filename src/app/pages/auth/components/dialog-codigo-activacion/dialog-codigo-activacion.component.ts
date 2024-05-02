import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'esp-dialog-codigo-activacion',
  templateUrl: './dialog-codigo-activacion.component.html',
  styleUrls: ['./dialog-codigo-activacion.component.scss']
})
export class DialogCodigoActivacionComponent {

  msgError!: string;
  status: RequestStatus = 'init';

  formCodeEmail = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required]],
  });
  
  constructor(@Inject(DIALOG_DATA) public data: any,
              private formBuilder:FormBuilder,
              private authService: AuthService,
              private _notificacion: NotificationService,
              private _dialogRef:DialogRef<DialogCodigoActivacionComponent>,
              private _router: Router){

  }
  ngOnInit(){
  }
  onClose(){
    this._dialogRef.close();
  }
  onSave(){
  }
  validateCodeEmail() {
    if (this.formCodeEmail.valid) {
      const { code } = this.formCodeEmail.getRawValue();
      this.authService.validateCode(code, this.data.genWithCode,this.data.numDoc).subscribe({
        next: (rta) => {
          if (rta.code == 0) {
            this.authService.confirmEmailSIGPS(this.data.genWithCode).subscribe((data)=>{
              if (data.code == 0) {
                this.status = 'success';
                this._notificacion.success('Se registró correctamente su usuario');
                this._dialogRef.close();
                this._router.navigate(['login']);
              }
              else{
                this._notificacion.error(data.message);
                this.status = 'failed';
              }
            })
          } else {
            this.formCodeEmail.setErrors({'invalid':true})
            this.status = 'failed';
            //this._notificacion.error(rta.message);
            this.msgError = rta.message.toUpperCase();
          }
        },
        error: (rta) => {
          this.status = 'failed';
        },
      });
    } else {
      this.formCodeEmail.markAllAsTouched();
    }
  }
}
