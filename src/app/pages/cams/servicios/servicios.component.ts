import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

 form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  @ViewChild('paginator') paginator: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'descripcion',
    'celular',
    'fechaInscripcion',
    'codigo',
    'red',
    'estado',
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private serviciosService: CiramsService
    ) {
      breadcrumService.link1$.next({ url: '/cams/servicios', title:'SERVICIOS' });
      breadcrumService.activeTab$.next('servicios');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      //this.loadServicios()

  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadCirams(){
    const tmp = this.serviciosService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/servicios/show/'+codigo, title:nameLink});
      this.router.navigate(['/servicios/show/', codigo]);
  }

}
