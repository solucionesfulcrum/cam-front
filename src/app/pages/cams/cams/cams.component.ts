import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CamsService } from 'src/app/core/_service/cams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-cams',
  templateUrl: './cams.component.html',
  styleUrls: ['./cams.component.css'],
})
export class CamsComponent implements OnInit {
  form = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  displayedColumns: string[] = [
    'index',
    'descripcion',
    'celular',
    'fechaInscripcion',
    'codigo',
    'red',
    'estado',
  ];

  breadcrum1: { url: string; title: string };
  breadcrum2: { url: string; title: string };
  breadcrum3: { url: string; title: string };

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private camsService: CamsService
  ) {
    breadcrumService.link1$.next({ url: '/cams', title: 'CAMS' });
    this.breadcrumService.link2$.next({ url: '', title: '' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    breadcrumService.activeTab$.next('/cams');
    this.loadCams();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = function (record, filter) {
      return record.estado.toLocaleLowerCase() == filter.toLocaleLowerCase();
    };
  }

  loadCams() {
    const tmp = this.camsService.listar().subscribe((rta: any) => {
      this.dataSource = new MatTableDataSource(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filtrarFechas(): void {}

  setLink2(nameLink: string, codigo: string) {
    this.breadcrumService.link2$.next({
      url: '/cams/show/' + codigo,
      title: nameLink,
    });
    this.router.navigate(['/cams/show/', codigo]);
  }

  getClassRow(i: number): string {
    let row = '';
    if (i % 2 != 0) row = 'rowColor';
    return row;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeDisponible(event: any) {
    switch (parseInt(event.value)) {
      case 1: {
        console.log('changeDisponible 1...');
        //const filterValue = (event.target as HTMLInputElement).value;
        const filterValue = '1'
        this.dataSource.filter = filterValue.trim().toLowerCase();

        break;
      }
      case 2: {
        console.log('changeDisponible 2...');
        break;
      }
      default: {
        console.log('changeDisponible 0...');
        break;
      }
    }
  }
}
