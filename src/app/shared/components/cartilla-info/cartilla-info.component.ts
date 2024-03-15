import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, EventEmitter, Input, LOCALE_ID, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormatoCartilla } from './formato-cartilla.model';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-cartilla-info',
  templateUrl: './cartilla-info.component.html',
  styleUrls: ['./cartilla-info.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  standalone: true,
  imports: [CommonModule, RouterModule, CdkMenuModule],
})
export class CartillaInfoComponent {

  @Input()
  cartillas: FormatoCartilla[] = [];

  @Input()
  redireccionNombre: any = null;

  @Input()
  forzarDesombreado: boolean = false;

  @Input()
  esFuncion: boolean = false;

  @Output()
  funcionBoton = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(){
  }

}
