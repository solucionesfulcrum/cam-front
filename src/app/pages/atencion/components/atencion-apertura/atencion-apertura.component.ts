import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { UserService } from '@shared/stores/user.service';
import { AtencionCitasService } from '@services/atencion/atencion-citas.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'esp-atencion-apertura',
  templateUrl: './atencion-apertura.component.html',
  styleUrls: ['./atencion-apertura.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'es'}]
})
export class AtencionAperturaComponent {

  today = new Date();

  rutas = AppRoute;

  usuario = this._userService.currentUser;

  constructor(private _userService                          : UserService,
              public  _atencionService                      : AtencionCitasService){

  }

  ngOnInit(){
  }
}
