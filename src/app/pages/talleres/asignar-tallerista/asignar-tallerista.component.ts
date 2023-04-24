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

@Component({
  selector: 'app-asignar-tallerista',
  templateUrl: './asignar-tallerista.component.html',
  styleUrls: ['./asignar-tallerista.component.css'],
})
export class AsignarTalleristaComponent implements OnInit {
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

  uo: Cam | Ciram | Programa | null;
  list_uo: any[] 
  id = '';
  name = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private helpperService: HelpperService,
    private authService: AuthService,
    private camsService: CamsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    breadcrumService.activeTab$.next('programacion');
    this.breadcrumService.link1$.next({ url: '/talleres/programacion', title: 'PROGRAMACIÓN', });
    this.breadcrumService.link3$.next({ url: '/talleres/programacion/'+this.id+'/asignar-tallerista' , title: 'ASIGNAR TALLERISTA' });

    this.loadCamById(this.id); //carga datos reales del servidor
    helpperService.uo$.next(null);
    helpperService.show_list$.next(false);
    this.loadUsers();

    this.helpperService.uo$.subscribe((event) => {
      this.uo = event;
    });

    this.helpperService.list_uo$.subscribe((event) => {
      this.list_uo = event;
    });
  }

  ngOnInit(): void {}

  filtrarTabla(event: any): void {}

  setLink2(
    nameLink: string,
    codigo: string,
    unidadOperativa: Cam | Ciram | Programa
  ) {
    this.helpperService.uo$.next(unidadOperativa);
    this.breadcrumService.link2$.next({
      url: '/talleres/programacion/' + codigo,
      title: nameLink,
    });
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
