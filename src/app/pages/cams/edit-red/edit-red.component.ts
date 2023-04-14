import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';
import { RedesService } from 'src/app/core/_service/redes.service';
import { Red } from 'src/app/core/_model/red.model';

@Component({
  selector: 'app-edit-red',
  templateUrl: './edit-red.component.html',
  styleUrls: ['./edit-red.component.css']
})
export class EditRedComponent {

form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(1), Validators.required]],
    nombre: ['', [ Validators.required, Validators.minLength(3)]],
    tipo: ['', [ Validators.required]],
    region: ['', [ Validators.required, Validators.minLength(6)]],
  });

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string }
  subBreadcrum3:{url:string, title:string }

  status: RequestStatus = 'init';
  cantMinCaracterForBusqueda=3
  red:Red
  cam:Cam
  cams: Cam[];
  ubigeos: UbiGeo[];
  ubigeo:UbiGeo
  id ='' 

 constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private camsService:CamsService,
  private http: HttpClient,
  private ubigeoService:UbiGeoService,
  private redService:RedesService,
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/redes', title:'REDES ESSALUD'});
      this.breadcrumService.link3$.next({ url: '/cams/redes/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('redes');
      this.loadCams();
      this.loadUbigeos();
  }

  saveEditRed(){
      if (this.form.valid) {
      this.status = 'loading';
      const { codigo, nombre, tipo, region } = this.form.getRawValue();
      const updateCamm= { codigo, nombre, tipo, region :this.ubigeo.descDep }
      Object.assign(this.cam, updateCamm  ) // actualiza en front
      this.redService.actualizar(this.red, parseInt(this.id))
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.router.navigate(['/cams/redes'])
        },
        error : () =>{
          this.status = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  loadRedById(id:string){
    const tmp = this.redService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.red = rta
      this.breadcrumService.link2$.next({ url: '/cams/redes/show/'+this.id, title:rta.nombre });
    })
  }

 loadCams(){
    const tmp = this.camsService.listar()
    .subscribe((rta:any) =>{
      this.cams= rta
    })
  }

  loadUbigeos(){
    this.ubigeoService.listar()
    .subscribe((rta:any) =>{
      this.ubigeos= rta
    })
  }

}