import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-cirams',
  templateUrl: './cirams.component.html',
  styleUrls: ['./cirams.component.css'],
})
export class CiramsComponent implements OnInit {
  form = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'descripcionC',
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
    private ciramService: CiramsService
  ) {
    breadcrumService.link1$.next({ url: '/cams/cirams', title: 'CIRAMS' });
    breadcrumService.activeTab$.next('cirams');
    this.breadcrumService.link2$.next({ url: '', title: '' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.loadCirams();
  }

  ngOnInit(): void {}

  filtrarTabla(event: any): void {}

  loadCirams() {
    const tmp = this.ciramService.listar().subscribe((rta: any) => {
      this.dataSource = new MatTableDataSource(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  setLink2(nameLink: string, codigo: string) {
    this.breadcrumService.link2$.next({
      url: '/cirams/show/' + codigo,
      title: nameLink,
    });
    this.router.navigate(['/cams/cirams/show/', codigo]);
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
}
