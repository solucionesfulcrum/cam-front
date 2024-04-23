import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { MaterialModule } from 'src/app/material/material.module';
import { MatListModule } from '@angular/material/list';
import { CdkMenuModule } from '@angular/cdk/menu';
import { AuthService } from '@services/auth.service';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SharedModule, MatListModule, CdkMenuModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  rutas = AppRoute;
  unid = JSON.parse(localStorage.getItem('UnidElegida')!);
  positions = [
    new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' },
    ),
  ];
  
  unidOpeUserSession!: string;
  userInfo: any = Object();
  userCategoria: string = '';
  showUnidOpe: boolean = false;
  showCiram: boolean= false;
  listCiram: any;

  constructor(private datosService : DatosGeneralesService,
              private authService:AuthService,
              private router:Router){}

  ngOnInit(){
    // console.log(JSON.parse(localStorage.getItem('UnidElegida')!));
    // console.log((JSON.parse(localStorage.getItem('camUser')!)))
    if(localStorage.getItem('UnidElegida') != 'null'){
      // let idUnid: string;
      // this.userCategoria = (JSON.parse(localStorage.getItem('camUser')!)).categoria;
      this.userInfo = (JSON.parse(localStorage.getItem('camUser')!));
      this.unidOpeUserSession = (JSON.parse(localStorage.getItem('UnidElegida')!)).unidOperativa;
      this.showUnidOpe = true;
      this.showCiram = true;
      // idUnid = (JSON.parse(localStorage.getItem('camUser')!)).idUnidOperativa;
      // this.datosService.getUnidadesOperativas('').subscribe((data) =>{
      //   this.unidOpeUserSession = data.data.find((x: any)=> {return x.idUnidOperativa == idUnid!}).descripcionCompleta;
      //   this.showUnidOpe = true;
      // });
      this.authService.getListarCiram(parseInt(this.unid.idUnidOperativa)).subscribe((data) => {
        console.log("dataciram",data)
        this.listCiram = data.data
      })
    }
    else{
      this.unidOpeUserSession = 'SEDE CENTRAL';
      this.showUnidOpe = true;
      this.showCiram = true;
    }
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  selecionarCiram(unidCiram: any){
    console.log("selecion",unidCiram)
    /*localStorage.setItem('UnidElegida', JSON.stringify(unidCiram));
    this.unidOpeUserSession = (JSON.parse(localStorage.getItem('UnidElegida')!)).nombre;
    this.showCiram = true;
    this.showUnidOpe = true;
    this.router.navigate(['/app']);*/
  }

  administrarCiram(){
    this.router.navigate(['/app/adm-uo']);
  }
}
