import { Component, OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  links: FormatoTab[] = [
    {url: `/app/dashboard`, title:'Afiliados'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
