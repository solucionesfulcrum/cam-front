import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { DatosGeneralesService } from '@services/datos-generales.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { MaterialModule } from 'src/app/material/material.module';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SharedModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  rutas = AppRoute;

  unidOpeUserSession!: string;
  userCategoria: string = '';
  showUnidOpe: boolean = false;

  constructor(private datosService : DatosGeneralesService){}

  ngOnInit(){
    console.log(JSON.parse(localStorage.getItem('UnidElegida')!));
    // console.log((JSON.parse(localStorage.getItem('sigpsUser')!)))
    if(localStorage.getItem('UnidElegida') != 'null'){
      // let idUnid: string;
      // this.userCategoria = (JSON.parse(localStorage.getItem('sigpsUser')!)).categoria;
      this.unidOpeUserSession = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativa;
      this.showUnidOpe = true;
      // idUnid = (JSON.parse(localStorage.getItem('sigpsUser')!)).idUnidOperativa;
      // this.datosService.getUnidadesOperativas('').subscribe((data) =>{
      //   this.unidOpeUserSession = data.data.find((x: any)=> {return x.idUnidOperativa == idUnid!}).descripcionCompleta;
      //   this.showUnidOpe = true;
      // });
    }
    else{
      this.unidOpeUserSession = 'SEDE CENTRAL';
      this.showUnidOpe = true;
    }
  }
}
