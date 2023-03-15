import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RedesService } from 'src/app/core/_service/redes.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-ubigeos',
  templateUrl: './ubigeos.component.html',
  styleUrls: ['./ubigeos.component.css']
})
export class UbigeosComponent implements OnInit {

form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'descDep',
    'descProv',
    'descDis',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private ubigeoService:UbiGeoService 
    ) {
      breadcrumService.link1$.next({ url: '/ubigeos/ubigeos', title:'UBIGEOS' });
      breadcrumService.activeTab$.next('ubigeos');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      this.loadUbigeos()
  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadUbigeos(){
    const tmp = this.ubigeoService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/ubigeos/show/'+codigo, title:nameLink});
      this.router.navigate(['/ubigeos/show/', codigo]);
  } 

}