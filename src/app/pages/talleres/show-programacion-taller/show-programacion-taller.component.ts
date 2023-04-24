import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Usuario } from 'src/app/core/_model/usuario';
import { HelpperService } from 'src/app/shared/services/helpper.service';
import { Programa } from 'src/app/core/_model/programa.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../auth/services/auth-service.service';


@Component({
  selector: 'app-show-programacion-taller',
  templateUrl: './show-programacion-taller.component.html',
  styleUrls: ['./show-programacion-taller.component.css'],
})
export class ShowProgramacionTallerComponent implements OnInit {
  uo: Cam | Ciram | Programa | null;
  list_uo: any[] 

  form1 = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

displayedColumns: string[] = [
    'nombres',
    'usuario',
    'cam',
    'rol',
    'tieneVigencia',
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //sid = this.route.snapshot.paramMap.get('sid')
  id = '';
  name = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private helpperService: HelpperService,
    private authService: AuthService,
    private camsService: CamsService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    //this.subLinks[0]={url:'/talleres/programacion/show/'+this.id, title:this.cam.descripcion }

    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/talleres/programacion', title: 'PROGRAMACIÓN', });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.loadCamById(this.id); //carga datos reales del servidor
    this.breadcrumService.activeTab$.next('programacion');

    
    this.helpperService.uo$.subscribe((event) => {
      this.uo = event;
    });

    this.helpperService.list_uo$.subscribe((event) => {
      this.list_uo = event;
    });

    this.loadUsers()

  }

  ngOnInit(): void {
    
  }

  getClassRow(i: number): string {
    let row = '';
    if (i % 2 != 0) row = 'rowColor';
    return row;
  }

  setLink2(nameLink: string, codigo: string, unidadOperativa: Cam | Ciram | Programa ) {
    this.helpperService.uo$.next(unidadOperativa);
    this.breadcrumService.link2$.next({ url: '/talleres/programacion/' + codigo, title: nameLink });
    this.router.navigate(['/talleres/programacion/', codigo]);
  }

loadUsers() {
    return this.authService.getUsuariosFromSSO(1, 20).subscribe((rta: any) => {
      this.dataSource = new MatTableDataSource(rta.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  async loadCamById(id: string) {
    this.camsService
      .listarPorId(parseInt(this.id))
      .subscribe((rta: any) => {
        this.uo= rta;
        this.breadcrumService.link2$.next({
          url: '/talleres/programacion/' + this.id,
          title: rta.descripcion,
        });
      });
  }



 
}


