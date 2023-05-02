import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { AuthService } from '../../auth/services/auth-service.service';
import { MatSort } from '@angular/material/sort';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { HelpperService } from 'src/app/shared/services/helpper.service';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Programa } from 'src/app/core/_model/programa.model';
import { UnidadOperativaService } from 'src/app/core/_service/unidad-operativa.service';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css'],
})
export class ProgramacionComponent implements OnInit {
  displayedColumns: string[] = [
    'nombres',
    'usuario',
    'cam',
    'rol',
    'tieneVigencia',
  ];

  breadcrum1: { url: string; title: string };
  breadcrum2: { url: string; title: string };
  breadcrum3: { url: string; title: string };

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  form = this.formBuilder.group({
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
  });

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  list_uo: any[];
  DB_list_uo: any[];
  show_list:boolean= true

  nameRed:string 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private helpperService: HelpperService,
    private authService: AuthService,
    private camsService: CamsService,
    private unidadesOperativasService: UnidadOperativaService,
  ) {
    breadcrumService.activeTab$.next('programacion');
    breadcrumService.link1$.next({ url: '/talleres/programacion',  title: 'PROGRAMACIÓN' });
    this.breadcrumService.link2$.next({ url: '', title: '' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    helpperService.uo$.next(null);
    this.loadUsers();
    this.loadUnidadesOperativas();
    this.nameRed= localStorage.getItem("nombreUnidad")!


    helpperService.show_list$.subscribe(event => {
        this.show_list=event
    })

  }

  ngOnInit(): void {}

  filtrarTabla(event: any): void {}

  setLink2(nameLink: string, codigo: string, unidadOperativa: any ) {
    this.helpperService.uo$.next(unidadOperativa);
    this.breadcrumService.link2$.next({ url: '/talleres/programacion/' + codigo, title: nameLink });
    this.breadcrumService.link3$.next({ url: '' , title: ''});
    this.router.navigate(['/talleres/programacion/', codigo]);
  }

  getClassRow(i: number): string {
    let row = '';
    if (i % 2 != 0) row = 'rowColor';
    return row;
  }

  changeEstado(event: any) {
    switch (parseInt(event.value)) {
      case 1: {
        console.log('changeDisponible 1...');
        break;
      }
      case 2: {
        console.log('changeDisponible 2...');
        break;
      }
      default: {
        break;
      }
    }
  }

  loadUsers() {
    return this.authService.getUsuariosFromSSO(1, 20).subscribe((rta: any) => {
      this.dataSource = new MatTableDataSource(rta.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadCams() {
    const tmp = this.camsService.listar().subscribe((rta: any) => {
      this.helpperService.list_uo$.next(rta);
      this.list_uo = rta;
      this.DB_list_uo = rta;
    });
  }


  loadUnidadesOperativas() {
    const idRed = localStorage.getItem("unidadOperativa")
    const tmp = this.unidadesOperativasService.getUnidadesOperativasForRed(idRed!).subscribe((rta: any) => {
      this.helpperService.list_uo$.next(rta);
      this.list_uo = rta;
      this.DB_list_uo = rta;
    });
  }

  applyFilter(event: Event) {
    const searchTex = (event.target as HTMLInputElement).value;
    const results: any = this.DB_list_uo.filter(
      (pr) => pr.nombre.toLowerCase().indexOf(searchTex.toLowerCase()) > -1
    ).map((res) => res);
    if (results.length > 0) this.list_uo = results;
    return results;
  }


}
