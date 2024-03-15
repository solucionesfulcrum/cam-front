import { Component,OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
 
  links: FormatoTab[] = [
    {url: `/app/dashboard`, title:'Afiliados'}
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
