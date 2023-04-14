import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-redes',
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.css']
})
export class RedesComponent implements OnInit {

 form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'nombre',
    'redasiscod',
    'tipo',
    'region',
    'estado',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private redesService: RedesService 
    ) {
      breadcrumService.link1$.next({ url: '/cams/redes', title:'REDES ESSALUD' });
      breadcrumService.activeTab$.next('redes');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      this.loadRedes()
  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadRedes(){
    const tmp = this.redesService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/redes/show/'+codigo, title:nameLink});
      this.router.navigate(['/cams/redes/show/', codigo]);
  } 

getClassRow(i:number) :string {
    console.log("getClassRow: ", i)
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

}