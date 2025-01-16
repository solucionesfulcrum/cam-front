import { Component,OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

@Component({
  selector: 'esp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
 
  links: FormatoTab[] = [
    {url: `/app/dashboard`, title:'Afiliados'},
    // {url: `/app/dashboard/asistencias`, title:'Asistencias'},
   {url: `/app/${AppRoute.DASHBOARD}/${AppRoute.DASHBOARD_ASISTENCIAS_RAPIDAS}`, title:'Asistencias Rápidas'},
   {url: `/app/${AppRoute.DASHBOARD}/${AppRoute.DASHBOARD_ASISTENCIAS_PROGRAMADAS}`, title:'Asistencias Programadas'},
  ];
  

  constructor() { }

  ngOnInit(): void {
  }
}
