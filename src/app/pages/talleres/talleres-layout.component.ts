import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-talleres-layout',
  templateUrl: './talleres-layout.component.html',
  styleUrls: ['./talleres-layout.component.css']
})
export class TalleresLayoutComponent implements OnInit {

  links=[
    {url:'analisis', title:'ANALISIS'},
    {url:'programacion', title:'PROGRAMACIÓN'},
    {url:'servicios', title:'SERVICIOS'},
    {url:'cirams', title:'CIRAMS'},
    {url:'talleristas', title:'TALLERISTAS'},
  ]

  breadcrum1:{url:string, title:string }
  breadcrum2:{url:string, title:string }
  breadcrum3:{url:string, title:string }

  activeTab= 'analisis'

 constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService:BreadcrumService
  ) {

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
    let active = '/talleres/analisis'
    if ( path === '/talleres/programacion')
     active= 'programacion'

    if ( path === '/talleres/servicios')
     active= 'servicios'

    if ( path === '/talleres/cirams')
     active= 'cirams'

    if ( path === '/talleres/talleristas')
     active= 'talleristas'

     return active
  }

}

