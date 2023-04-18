import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramasService } from 'src/app/core/_service/programas.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css']
})
export class ProgramasComponent implements OnInit {

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
    private programasService: ProgramasService 
    ) {
      breadcrumService.link1$.next({ url: '/cams/programas', title:'PROGRAMAS' });
      breadcrumService.activeTab$.next('programas');
      this.breadcrumService.link2$.next({url:'' ,title:''});
      this.breadcrumService.link3$.next({url:'', title:''});
      //this.loadProgramas()

  }

  ngOnInit(): void {
  }

  filtrarTabla(event: any): void {}

  loadProgramas(){
    const tmp = this.programasService.listar()
    .subscribe((rta:any) =>{
      this.dataSource = rta
    })
  }

  setLink2(nameLink: string, codigo:string){
      this.breadcrumService.link2$.next({url:'/programas/show/'+codigo, title:nameLink});
      this.router.navigate(['/programas/show/', codigo]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}