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

  cams: Cam[];
  dbCams: Cam[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService,
    private camsService: CamsService
  ) {
    breadcrumService.link1$.next({
      url: '/talleres/programacion',
      title: 'PROGRAMACIÓN',
    });
    breadcrumService.activeTab$.next('programacion');
    this.breadcrumService.link2$.next({ url: '', title: '' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.loadUsers();
    this.loadCams();
  }

  ngOnInit(): void {}

  filtrarTabla(event: any): void {}

  setLink2(nameLink: string, codigo: string) {
    this.breadcrumService.link2$.next({
      url: '/talleres/show/' + codigo,
      title: nameLink,
    });
    this.router.navigate(['/talleres/programacion/show/', codigo]);
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
      this.cams = rta;
      this.dbCams = rta;
    });
  }

  applyFilter(event: Event) {
    const searchTex = (event.target as HTMLInputElement).value;
    const results: any = this.dbCams
      .filter(
        (pr) =>
          pr.descripcion.toLowerCase().indexOf(searchTex.toLowerCase()) > -1
      )
      .map((res) => res);
    if (results.length > 0) this.cams= results;
    return results;
  }
}
