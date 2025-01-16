import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

const ruta_base = "/app/admin/edit-user";

@Component({
  selector: 'esp-sidenav-admin-user',
  templateUrl: './sidenav-admin-user.component.html',
  styleUrls: ['./sidenav-admin-user.component.scss']
})
export class SidenavAdminUserComponent {

  links: FormatoTab[] = [
    {url: `${ruta_base}/informacion-personal`, title:'Información Personal'},
    {url: `${ruta_base}/nivel-educativo`, title:'Nivel Educativo'},
    {url: `${ruta_base}/seguridad`, title:'Seguridad'},
  ];


  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    
   }

  ngOnInit(): void {
   
  }
}
