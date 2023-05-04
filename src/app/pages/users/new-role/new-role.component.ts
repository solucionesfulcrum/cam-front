import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.css']
})
export class NewRoleComponent {

subBreadcrum1:{url:string, title:string }
subBreadcrum2:{url:string, title:string }
subBreadcrum3:{url:string, title:string }
status: RequestStatus = 'init';
newCiram :Ciram
cantMinCaracterForBusqueda=3
cams: Cam[];
ubigeos: UbiGeo[];
cam:Cam;
ubigeo: UbiGeo;

rol: any

form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(4), Validators.required]],
    nombre: ['', [Validators.minLength(4), Validators.required]],
  });

 constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private ciramService: CiramsService,
  private http: HttpClient,
  private authService: AuthService,
  private ubigeoService:UbiGeoService,

    ) {

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/users/roles', title:'ROLES'});
      this.breadcrumService.link2$.next({ url: '/users/roles/new', title:'NUEVO ROL'});
      this.breadcrumService.link3$.next({ url: '', title:''});
      this.breadcrumService.activeTab$.next('roles');
  }

  saveRole(){
      if (this.form.valid) {
      this.status = 'loading';
      const { codigo, nombre } = this.form.getRawValue();
      this.rol = {codigo, nombre }
      this.authService.registrarRolesFromSSO(codigo, nombre )
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.router.navigate(['/usuarios/roles'])
        },
        error : () =>{
          this.status = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

}