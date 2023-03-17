import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Red } from 'src/app/core/_model/red.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-cam',
  templateUrl: './new-cam.component.html',
  styleUrls: ['./new-cam.component.css']
})
export class NewCamComponent implements OnInit {

 form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(6), Validators.required]],
    descripcion: ['', [ Validators.required, Validators.minLength(8)]],
    tipo: ['', [ Validators.required, Validators.minLength(8)]],
    celular: ['', [ Validators.required, Validators.minLength(8)]],
    email: ['', [ Validators.required, Validators.minLength(8)]],
    fechaInscripcion: ['', [ Validators.required, Validators.minLength(8)]],
    direccion: ['', [ Validators.required, Validators.minLength(8)]],
    red: ['', [ Validators.required, Validators.minLength(8)]],
    ubigeo: ['', [ Validators.required, Validators.minLength(8)]],
    estado: ['', [ Validators.required, Validators.minLength(8)]],
  });

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 
  status: RequestStatus = 'init';
  newCam :Cam
  red:Red
  ubigeo:UbiGeo

 constructor(
  private router: Router, 
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private camService:CamsService
    ) {

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams', title:'CAMS'});
      this.breadcrumService.link2$.next({ url: '/cams/new', title:'NUEVO CAM'});
      this.breadcrumService.link3$.next({ url: '', title:''});
      this.breadcrumService.activeTab$.next('/cams');
  }

  ngOnInit(): void {
  }

  saveCam(){
    console.log("newCam function")
      if (this.form.valid) {
      this.status = 'loading';
      const { codigo, descripcion, tipo, celular, email, fechaInscripcion, direccion, estado} = this.form.getRawValue();
      this.newCam= {codigo, descripcion, tipo, celular, email, fechaInscripcion, direccion, estado, red:this.red, ubigeo:this.ubigeo }

      this.camService.registrar(this.newCam)
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.router.navigate(['/cams'])
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