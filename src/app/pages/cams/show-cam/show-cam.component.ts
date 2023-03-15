import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { CamsService } from 'src/app/core/_service/cams.service';
import {Cam } from 'src/app/core/_model/cam.model'



@Component({
  selector: 'app-show-cam',
  templateUrl: './show-cam.component.html',
  styleUrls: ['./show-cam.component.css']
})
export class ShowCamComponent implements OnInit {

  cam: Cam  
  subLinks=[
    {url:'', title:''},
    {url:'', title:''},
    {url:'', title:''},
  ]

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 

  subActiveTab= '/show'

  form1= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });



  //sid = this.route.snapshot.paramMap.get('sid')
  id ='' 
  name ='' 

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private camsService : CamsService
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 
      this.subLinks[0]={url:'/cams/show/'+this.id, title:'USUARIOS'}
      this.subLinks[1]={url:'/cams/show/'+this.id+'/cirams', title:'CIRAMS'}
      this.subLinks[2]={url:'/cams/show/'+this.id+'/programas', title:'PROGRAMAS'}

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams', title:'CAMS'});
      this.loadCamById(this.id) //carga datos reales del servidor
      this.breadcrumService.link3$.next({url:'', title:''});
      this.breadcrumService.activeTab$.next('/cams');

    breadcrumService.subLink1$.subscribe(event => {
        this.subBreadcrum1=event
    })

    breadcrumService.subLink2$.subscribe(event => {
        this.subBreadcrum2=event
    })

    breadcrumService.subLink3$.subscribe(event => {
        this.subBreadcrum3=event
    })

    breadcrumService.subActiveTab$.subscribe(event => {
        this.subActiveTab =event
    })

  }

  ngOnInit(): void {
  }

  loadCamById(id:string){
    const tmp = this.camsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.cam = rta
      this.breadcrumService.link2$.next({ url: '/cams/show/'+this.id, title:rta.descripcion });
    })
  }

}
