import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-afiliados-layout',
  templateUrl: './afiliados-layout.component.html',
  styleUrls: ['./afiliados-layout.component.css']
})
export class AfiliadosLayoutComponent {

  links3=[
    {url:'/afiliados/analisis', title:'Análisis'},
    {url:'/afiliados/solicitudes', title:'Solicitudes'},
    {url:'/afiliados', title:'Afiliados'},
    {url:'/afiliados/evaluacion', title:'Evaluación'},
   
  ]

  //activeLink = this.links3[2].url;
  activeTab= '/afiliados/afiliados'  // Valor predeterminado para activar la pestaña de afiliados

  constructor() { }

  ngOnInit(): void {
  }

  getActiveLink(path:string)
  {
      let active = '/afiliados'

      if ( path == '/afiliados')
        active = '/afiliados/afiliados'
        

      return active
  }
}

