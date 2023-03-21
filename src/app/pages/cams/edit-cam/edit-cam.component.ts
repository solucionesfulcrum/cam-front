import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Cam } from 'src/app/core/_model/cam.model';
import { Red } from 'src/app/core/_model/red.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-edit-cam',
  templateUrl: './edit-cam.component.html',
  styleUrls: ['./edit-cam.component.css']
})
export class EditCamComponent implements OnInit {

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
  cam:Cam
  cantMinCaracterForBusqueda=3
  redes: Red[];
  ubigeos: UbiGeo[];
  red:Red
  ubigeo:UbiGeo

  id =''

 constructor(
  private router: Router,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private camsService:CamsService,
  private http: HttpClient,
  private redesService: RedesService,
  private ubigeoService:UbiGeoService,
    ) {
      this.id = this.route.snapshot.paramMap.get('id')!

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams', title:'CAMS'});
      this.breadcrumService.link3$.next({ url: '/cams/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('/cams');
      this.loadCamById(this.id)

  }

  ngOnInit(): void {
    this.loadRedes();
    this.loadUbigeos();
  }

  saveEditCam(){
      if (this.form.valid) {
      this.status = 'loading';
      const { codigo, descripcion,  celular, email, fechaInscripcion, direccion} = this.form.getRawValue();
      const updateCamm= { idCam:parseInt(this.id), codigo, descripcion, tipo:'1', celular, email, fechaInscripcion: moment(fechaInscripcion).format('YYYY-MM-DD'), direccion, estado:1, red:this.red, ubigeo:this.ubigeo }
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

  loadCamById(id:string){
    const tmp = this.camsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.cam = rta
      console.log("rta fron edit cam: ", rta , " cam: ", this.cam)
      this.form.get('codigo')?.setValue(this.cam?.codigo!);
      this.form.get('descripcion')?.setValue(this.cam?.descripcion!);
      this.form.get('celular')?.setValue(this.cam?.celular!);
      this.form.get('email')?.setValue(this.cam?.email!);
      this.form.get('fechaInscripcion')?.setValue(moment(this.cam?.fechaInscripcion!).format('DD MM YYYY'));
      this.form.get('direccion')?.setValue(this.cam?.direccion!);
      this.form.get('red')?.setValue(rta.red.nombre);
      this.form.get('ubigeo')?.setValue(rta.ubigeo.descDis!);

      this.red = rta.red
      this.ubigeo = rta.ubigeo
      console.log("red: ", this.red, " ubigeo: ", this.ubigeo)
      this.breadcrumService.link2$.next({ url: '/cams/show/'+this.id, title:rta.descripcion });
    })
  }

 loadRedes(){
    const tmp = this.redesService.listar()
    .subscribe((rta:any) =>{
      this.redes= rta
    })
  }

  loadUbigeos(){
    const tmp = this.ubigeoService.listar()
    .subscribe((rta:any) =>{
      this.ubigeos= rta
    })
  }

}
