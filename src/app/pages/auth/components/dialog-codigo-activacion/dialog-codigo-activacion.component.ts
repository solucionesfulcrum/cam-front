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
    console.log("data de componente registrar", this.data)
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
          console.log("data de resgister", rta.data)
          var result = JSON.parse(rta.data);
          if (result = true) {
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
              console.log(data)
            })
            this.status = 'success';
            this._dialogRef.close();
            this._router.navigate(['login']);
          } else {
            //this.formCodeEmail.controls.code.setValue("")
            this.formCodeEmail.setErrors({'invalid':true})
            this.status = 'failed';
          }
          /*var resError = true;
          try {
            var result = JSON.parse(rta.data);
          } catch (error) {
            resError = false;
          }
          if (rta.data === 'true') {
            resError = false;
          }
          if(resError){
            this.msgError = result.message;
            this.msgError = this.msgError[0].toUpperCase() + this.msgError.substr(1).toLowerCase();
            this.status = 'failed';
            console.log('Error detected: ', result);
          }
          else{
            console.log('next for validate code: ', rta);
            if (rta.data === 'true') {
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
                console.log(data)
              })
              this.status = 'success';
              this._dialogRef.close();
              this._router.navigate(['login']);
            } else {
              //this.formCodeEmail.controls.code.setValue("")
              this.formCodeEmail.setErrors({'invalid':true})
              this.status = 'failed';
            }
          }*/
        },
        error: (rta) => {
          console.log('error for validate code: ', rta);
          this.status = 'failed';
        },
      });
    } else {
      this.formCodeEmail.markAllAsTouched();
    }
  }
}
