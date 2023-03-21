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
import * as moment from 'moment';

@Component({
  selector: 'app-edit-ciram',
  templateUrl: './edit-ciram.component.html',
  styleUrls: ['./edit-ciram.component.css']
})
export class EditCiramComponent implements OnInit {

form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(1), Validators.required]],
    descripcion: ['', [ Validators.required, Validators.minLength(3)]],
    //tipo: ['', [ Validators.required, Validators.minLength(8)]],
    celular: ['', [ Validators.required, Validators.minLength(7), Validators.pattern("^[0-9]*$")]],
    email: ['', [ Validators.required, Validators.email]],
    //fechaInscripcion: ['', [ Validators.required, Validators.pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/)]],
    fechaInscripcion: ['', [ Validators.required ]],
    direccion: ['', [ Validators.required]],
    red: ['', [ Validators.required ]],
    ubigeo: ['', [ Validators.required, Validators.minLength(6)]],
  });


  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string }
  subBreadcrum3:{url:string, title:string }
  status: RequestStatus = 'init';
  cantMinCaracterForBusqueda=3
  ciram:Ciram
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
  private ciramsService: CiramsService
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/cirams', title:'CIRAMS'});
      this.breadcrumService.link3$.next({ url: '/cams/cirams/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('cirams');
  }

  ngOnInit(): void {
    this.loadCams();
    this.loadUbigeos();
  }

  saveEditCiram(){
      if (this.form.valid) {
      this.status = 'loading';
      const { codigo, descripcion,  celular, email, fechaInscripcion, direccion} = this.form.getRawValue();
      const updateCamm= { idCam:parseInt(this.id), codigo, descripcion, tipo:'1', celular, email, fechaInscripcion: moment(fechaInscripcion).format('YYYY-MM-DD'), direccion, estado:1, cam:this.cam, ubigeo:this.ubigeo }
      Object.assign(this.cam, updateCamm  )
      this.camsService.actualizar(this.cam, parseInt(this.id))
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

  loadCiramById(id:string){
    const tmp = this.ciramsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.ciram = rta
      this.breadcrumService.link2$.next({ url: '/cams/cirams/show/'+this.id, title:rta.descripcion });
    })
  }

 loadCams(){
    const tmp = this.camsService.listar()
    .subscribe((rta:any) =>{
      this.cams= rta
    })
  }

  loadUbigeos(){
    const tmp = this.ubigeoService.listar()
    .subscribe((rta:any) =>{
      this.ubigeos= rta
    })
  }

}