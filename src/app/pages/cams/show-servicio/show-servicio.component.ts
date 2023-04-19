import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Programa } from 'src/app/core/_model/programa.model';
import { ProgramasService } from 'src/app/core/_service/programas.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-show-servicio',
  templateUrl: './show-servicio.component.html',
  styleUrls: ['./show-servicio.component.css']
})
export class ShowServicioComponent implements OnInit {

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 

  id ='' 
  name ='' 
  programa:Programa

 constructor(
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private programaService : ProgramasService 
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/servicios', title:'SERVICIOS'});
      this.loadServicioById(this.id) //carga datos reales del servidor
      this.breadcrumService.link3$.next({url:'', title:''});
      this.breadcrumService.activeTab$.next('servicios');

    breadcrumService.subLink1$.subscribe(event => {
        this.subBreadcrum1=event
    })

    breadcrumService.subLink2$.subscribe(event => {
        this.subBreadcrum2=event
    })

    breadcrumService.subLink3$.subscribe(event => {
        this.subBreadcrum3=event
    })

  }

  ngOnInit(): void {
  }

  loadServicioById(id:string){
    const tmp = this.programaService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.programa = rta
      this.breadcrumService.link2$.next({ url: '/cams/servicios/show/'+this.id, title:rta.descripcion });
    })
  } 

}
