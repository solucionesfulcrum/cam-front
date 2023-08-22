import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../../auth/services/auth-service.service';

@Component({
  selector: 'app-ficha-afil',
  templateUrl: './ficha-afil.component.html',
  styleUrls: ['./ficha-afil.component.css']
})
export class FichaAfilComponent implements OnInit {

/*  displayedColumns: string[] = [
    'selecc',
    'usuario',
    'tipodoc',
    'nombres',
    'edad',
    'estcivil',
    'ipress',
    'tieneVigencia',
  ]; */

  breadcrum1:{url:string, title:string }   
  breadcrum2:{url:string, title:string } 
  breadcrum3:{url:string, title:string } 


  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService,
    ) {
    breadcrumService.link1$.next({ url: '/afiliados/solicitudes', title:'SOLICITUDES' });
    this.breadcrumService.link2$.next({url:'' ,title:''});
    this.breadcrumService.link3$.next({url:'', title:''});
    breadcrumService.activeTab$.next('/afiliados/solicitudes');
    this.loadUsers()
   }

  ngOnInit(): void {
  }

  loadUsers(){
    return this.authService.getUsuariosFromSSO(1,20)
    /*.subscribe((rta:any) =>{
      this.dataSource = new MatTableDataSource(rta.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })*/
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }
}

