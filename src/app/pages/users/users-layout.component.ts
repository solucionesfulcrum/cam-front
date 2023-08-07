import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-users-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.css']
})
export class UsersLayoutComponent  implements OnInit {

  links=[
    {url:'/usuarios', title:'Usuarios', minWidth:'71px'},
    {url:'roles', title:'Roles', minWidth:'47px'}
  ]

  breadcrum1:{url:string, title:string }
  breadcrum2:{url:string, title:string }
  breadcrum3:{url:string, title:string }

  //activeLink = this.links[0].url;
  activeTab= '/usuarios'  // Valor predeterminado para activar la pestaña de usuarios


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
    let active = '/roles'

    if ( path === '/usuarios/roles')
     active= 'roles'

     return active
  }

}