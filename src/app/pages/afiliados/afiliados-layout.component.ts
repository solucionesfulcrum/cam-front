import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-afiliados-layout',
  templateUrl: './afiliados-layout.component.html',
  styleUrls: ['./afiliados-layout.component.scss']
})
export class AfiliadosLayoutComponent {

  links3=[
    {url:'/app/afiliados', title:'Solicitudes', tituloOpcional: 'Bandeja'},
    {url:'/app/afiliados/evaluacion', title:'Evaluación', tituloOpcional: 'Evaluaciones'},
    
    // {url:'/afiliados/analisis', title:'Análisis'},
    // {url:'/afiliados/solicitudes', title:'Solicitudes'},
    // {url:'/afiliados', title:'Afiliados'},
    // {url:'/afiliados/evaluacion', title:'Evaluación'},
  ]


  constructor() { }

  ngOnInit(): void {
  }

}

