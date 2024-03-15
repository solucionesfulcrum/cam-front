import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from 'src/app/utils/validators';
import { ButtonComponent } from 'src/app/shared/components/btn/button.component';
import { AuthService } from '@services/auth.service';
import { RequestStatus } from '@models/request-status.model';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html'
})
export class RecoveryFormComponent {
 form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token='';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router ) {
    this.route.queryParamMap.subscribe(
      params =>{
        const token = params.get('token')
        if( token ){
          this.token = token
        }
        else{
          this.router.navigate(['/login'])
        }
      }
    )
  }

  recovery() {
    if (this.form.valid) {
      const {newPassword} = this.form.getRawValue()
      this.status ='loading'
      this.authService.changePassword(this.token, newPassword )
      .subscribe({
        next:()=>{
          this.status ='success'
          this.router.navigate(['/login'])
        },
        error:()=>{
          this.status ='failed'
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }
}
