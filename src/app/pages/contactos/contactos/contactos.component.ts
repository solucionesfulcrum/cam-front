import { Component, OnInit } from '@angular/core';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  links: FormatoTab[] = [
    {url: `/app/contactos`, title:'Afiliados'},
    {url: `/app/contactos/talleristas`, title:'Talleristas'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
