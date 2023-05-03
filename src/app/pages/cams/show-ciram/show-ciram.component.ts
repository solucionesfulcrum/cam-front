import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Usuario } from 'src/app/core/_model/usuario';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-show-ciram',
  templateUrl: './show-ciram.component.html',
  styleUrls: ['./show-ciram.component.css']
})
export class ShowCiramComponent implements OnInit {

  ciram: Ciram 
  subLinks=[
    {url:'', title:''},
    //{url:'', title:''},
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
  usuarios : Usuario[]= []

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private ciramsService : CiramsService 
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 
      this.subLinks[0]={url:'/cams/cirams/show/'+this.id, title:'USUARIOS'}
      //this.subLinks[1]={url:'/cams/cirams/show/'+this.id+'/programas', title:'Programas'}

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/cirams', title:'CIRAMS'});
      this.loadCiramById(this.id) //carga datos reales del servidor
      this.breadcrumService.link3$.next({url:'', title:''});
      this.breadcrumService.activeTab$.next('cirams');

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

  loadCiramById(id:string){
    const tmp = this.ciramsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.ciram = rta
      this.breadcrumService.link2$.next({ url: '/cams/cirams/show/'+this.id, title:rta.descripcion });
    })
  } 

}