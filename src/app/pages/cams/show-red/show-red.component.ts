import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Red } from 'src/app/core/_model/red.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-show-red',
  templateUrl: './show-red.component.html',
  styleUrls: ['./show-red.component.css']
})
export class ShowRedComponent implements OnInit {

  red:Red 
  subLinks=[
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
  private redesService : RedesService 
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 
      this.subLinks[0]={url:'/cams/redes/show/'+this.id, title:'USUARIOS'}
      this.subLinks[1]={url:'/cams/redes/show/'+this.id+'/cams', title:'CAMS'}

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/redes', title:'REDES ESSALUD'});
      this.loadRedById(this.id) //carga datos reales del servidor
      this.breadcrumService.link3$.next({url:'', title:''});
      this.breadcrumService.activeTab$.next('redes');

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

  loadRedById(id:string){
    const tmp = this.redesService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      console.log("region.... ", rta)
      this.red= rta
      this.breadcrumService.link2$.next({ url: '/cams/redes/show/'+this.id, title:rta.descripcion });
    })
  } 

}