import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';



@Component({
  selector: 'app-sub-list-cirams-cam',
  templateUrl: './sub-list-cirams-cam.component.html',
  styleUrls: ['../show-cam.component.css']
})
export class SubListCiramsCamComponent implements OnInit {

form= this.fb.group({
  fechaIni: [''],
  fechaFin: [''],
});

displayedColumns: string[] = [
    'circuloAdultoMayor',
    'adminCiram',
    'codigo',
    'fechaCreacion',
    'estado',
  ];

  @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;
  dataSource= new MatTableDataSource<any>();

  id ='' 
  name ='CAM TALARA' 
  cirams : Ciram[] = []

 constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private ciramService: CiramsService,
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      breadcrumService.subLink1$.next({ url: './cirams', title:'CIRAMS'});
      breadcrumService.subLink2$.next({ url: '', title:'' });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/show/'+this.id+'/cirams');

    });

  }

  ngOnInit(): void {
    this.cirams = []
    this.loadCiramsByCam()
  }

  loadCiramsByCam(){
    this.ciramService.getCiramsByCam(this.id)
    .subscribe((rta:any) =>{
      console.log("its loading.... ", rta )
      this.cirams = rta
      this.dataSource = rta
    })
  } 

}