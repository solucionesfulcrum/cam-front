import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CamsService } from 'src/app/core/_service/cams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';


@Component({
  selector: 'app-cams',
  templateUrl: './cams.component.html',
  styleUrls: ['./cams.component.css']
})
export class CamsComponent implements OnInit {

form= this.fb.group({
  fechaIni: [''],
  fechaFin: [''],
});

displayedColumns: string[] = [
    'descripcion',
    'celular',
    'fechaInscripcion',
    'codigo',
    'red',
    'estado',
  ];

  breadcrum1:{url:string, title:string }   
  breadcrum2:{url:string, title:string } 
  breadcrum3:{url:string, title:string } 

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private camsService: CamsService 
    ) {
      breadcrumService.link1$.next({ url: '/cams', title:'CAMS' });
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      breadcrumService.activeTab$.next('/cams');
      this.loadCams()
  }

  ngOnInit(): void {
  }

  loadCams(){
    const tmp = this.camsService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  filtrarFechas(): void {}

  filtrarTabla(event: any): void {}

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/cams/show/'+codigo, title:nameLink});
      this.router.navigate(['/cams/show/', codigo]);
  }

}
