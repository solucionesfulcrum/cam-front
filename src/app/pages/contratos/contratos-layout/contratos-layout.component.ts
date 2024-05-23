import { Component } from '@angular/core';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-contratos-layout',
  templateUrl: './contratos-layout.component.html',
  styleUrls: ['./contratos-layout.component.scss']
})
export class ContratosLayoutComponent {

  enlaces=[
    {url:`/app/${AppRoute.CONTRATOS}`, title:'Contratos'},
    {url:`/app/${AppRoute.CONTRATOS}/contratos-red`, title:'Contratos RED'},
    // {url:'/app/afiliados/evaluacion', title:'Evaluación', tituloOpcional: 'Evaluaciones'},
    
    // {url:'/afiliados/analisis', title:'Análisis'},
    // {url:'/afiliados/solicitudes', title:'Solicitudes'},
    // {url:'/afiliados', title:'Afiliados'},
    // {url:'/afiliados/evaluacion', title:'Evaluación'},
  ]
}
