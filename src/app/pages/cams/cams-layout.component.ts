import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-cams-layout',
  templateUrl: './cams-layout.component.html',
  styleUrls: ['./cams-layout.component.css']
})
export class CamsLayoutComponent implements OnInit {

  links=[
    {url:'/cams', title:'CAMS'},
    {url:'cirams', title:'CIRAMS'},
    //{url:'servicios', title:'SERVICIOS'},
    //{url:'programas', title:'PROGRAMAS'},
    //{url:'redes', title:'REDES'},
    //{url:'ubigeos', title:'UBIGEOS'},
  ]

  breadcrum1:{url:string, title:string }
  breadcrum2:{url:string, title:string }
  breadcrum3:{url:string, title:string }

  //activeLink = this.links[0].url;
  activeTab= '/cams'



 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService:BreadcrumService
  ) {

    /*
    //this.activeTab= this.getActiveLink(router.url)
    this.route.queryParamMap.subscribe(params=> {
      const oid = this.route.snapshot.paramMap.get('id')
      const oid2= params.get('id')
    })
    */


    breadcrumService.link1$.subscribe(event => {
        this.breadcrum1=event
    })

    breadcrumService.link2$.subscribe(event => {
        this.breadcrum2=event
    })

    breadcrumService.link3$.subscribe(event => {
        this.breadcrum3=event
    })

    breadcrumService.activeTab$.subscribe(event => {
        this.activeTab =event
    })

  } // end constructor

  ngOnInit(): void {
  }

  getActiveLink(path:string)
  {
    let active = '/cams'
    if ( path === '/cams/cirams')
     active= 'cirams'

    if ( path === '/cams/servicios')
     active= 'servicios'

     return active
  }

}
