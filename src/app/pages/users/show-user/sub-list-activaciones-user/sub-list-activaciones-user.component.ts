import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute,Params ,Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { UsuarioService } from '../../../../core/_service/usuario.service'




@Component({
  selector: 'app-sub-list-activaciones-user',
  templateUrl: './sub-list-activaciones-user.component.html',
  styleUrls: ['../show-user.component.css']
})
export class SubListActivacionesUserComponent implements OnInit {
  user: any;
  CAMS = [
    {
      i: '1',
      usuarioResponsable: 'ALMERNARA',
      fechaInicio: '31/08/2022',
      fechaFin: '31/12/2022',
      rol: 'Administrador CAM',
      perfil: 'TV',
    }, {
      i: '2',
      usuarioResponsable: 'AMAZONAS',
      fechaInicio: '31/08/2022',
      fechaFin: '31/12/2022',
      rol: 'Usuario CAM',
      perfil: 'USER',
    }, {
      i: '3',
      usuarioResponsable: 'AMAZONAS',
      fechaInicio: '31/08/2022',
      fechaFin: '31/12/2022',
      rol: 'Usuario CAM',
      perfil: 'USER',
    },
  ];

  
  form = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  displayedColumns: string[] = [
    //'i',
    'usuarioResponsable',
    'fechaInicio',
    'fechaFin',
    'rol',
    'estado',
    'opcion',
  ];

  @ViewChild('paginatorProfesional') paginatorProfesional: MatPaginator;
  

  id = ''
  name = 'CAM TALARA'
  dataSource: MatTableDataSource<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private usuarioService: UsuarioService
  ) {
    this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      breadcrumService.subLink1$.next({ url: './activaciones', title: 'ACTIVACIONES' });
      breadcrumService.subLink2$.next({ url: '', title: '' });
      breadcrumService.subLink3$.next({ url: '', title: '' });
      breadcrumService.subActiveTab$.next('/usuarios/show/' + this.id + '/activaciones');

    });
  }

  ngOnInit(): void {
    console.log("idUsuario",this.id)
    this.cargaUnidadesOperativas(this.id)
  }
  cargaUnidadesOperativas(id: string) {
    const tmp = this.usuarioService
      .getUnidadOperativaActiva(id)
      .subscribe((rta: any) => {
        this.user = rta.data[0].unidOperativa;
        console.log('Unidad Operativa... ', rta.data);
        this.dataSource = new MatTableDataSource<any>(rta.data);
        /*this.breadcrumService.link2$.next({
          url: '/usuarios/show/' + this.id,
          title: rta.nombres,
        });*/
      });
  }
  getClassRow(i: number): string {
    let row = ""
    if (i % 2 != 0)
      row = "rowColor"
    return row
  }

}