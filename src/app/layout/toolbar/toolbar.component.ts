import {
  Component, EventEmitter, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {OverlayModule} from '@angular/cdk/overlay';
import { AuthService } from '@services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { UserService } from '@shared/stores/user.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    OverlayModule,
    SharedModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})

export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter();
  userRol: string = '';
  //user$ = this._userService.currentUser$;
  isOpen= false
  userSesion : string = '';

  constructor(
    private authService:AuthService,
    private router:Router,
    private _userService:UserService){
    /*this.user$.subscribe(user=>{
      if (!user) {
        console.log("user",user);
        console.log("authService",authService.getProfile())
        
      }

      console.log("user2", user)
    })
    /*this.authService.getProfile().subscribe((data)=>{
      console.log("data usuario",data)
    })*/
  }

  ngOnInit(){
    if(localStorage.getItem("camUser") != null ){
      this.userSesion = JSON.parse(localStorage.getItem("camUser")!).nombres
    }else{
      this.userSesion = 'Datos no conocidos'
    }
    if(localStorage.getItem('UnidElegida') != 'null'){
      // let idUnid: string;
      if ((JSON.parse(localStorage.getItem('UnidElegida')!)).rol) {
        this.userRol = (JSON.parse(localStorage.getItem('UnidElegida')!)).rol;
      }
      else{
        this.userRol = 'Sin Rol Asignado';
      }
      // idUnid = (JSON.parse(localStorage.getItem('camUser')!)).idUnidOperativa;
      // this.datosService.getUnidadesOperativas('').subscribe((data) =>{
      //   this.unidOpeUserSession = data.data.find((x: any)=> {return x.idUnidOperativa == idUnid!}).descripcionCompleta;
      //   this.showUnidOpe = true;
      // });
    }
    else{
      this.userRol = 'Sin Rol Asignado';
    }
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }
}
