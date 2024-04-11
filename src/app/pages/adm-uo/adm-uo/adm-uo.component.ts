import { Component, OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-adm-uo',
  templateUrl: './adm-uo.component.html',
  styleUrls: ['./adm-uo.component.scss']
})
export class AdmUoComponent implements OnInit{
  links: FormatoTab[] = [
    {url: `/app/adm-uo`, title:'Centros'}
  ];
  constructor() { }

  ngOnInit(): void {
  }
}
