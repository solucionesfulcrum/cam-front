import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Programa } from 'src/app/core/_model/programa.model';
import { Servicios } from 'src/app/core/_model/servicios.model';
import { SubPrograma } from 'src/app/core/_model/sub-programa.model';
import { ProgramasService } from 'src/app/core/_service/programas.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { MatAccordion } from '@angular/material/expansion';
//import { search } from "ss-search"


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
})
export class ServiciosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  form = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });
  isLoadingEspecial =true 

  programas: Programa[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private serviciosService: ProgramasService
  ) {
    breadcrumService.link1$.next({
      url: '/cams/servicios',
      title: 'SERVICIOS',
    });
    breadcrumService.activeTab$.next('servicios');
    this.breadcrumService.link2$.next({ url: '', title: '' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.buildProgramas();
  }

  ngOnInit(): void {}

  filtrarTabla(event: any): void {}

  buildProgramas = async () => {
    this.programas = await this.loadProgramas();
  };

  loadProgramas(): any {
    return this.serviciosService.listarProgramas().subscribe((rta) => {
      this.programas = rta;

      //CARGAMOS LOS SUBPROGRAMAS
      this.programas.map((i_programa: Programa) => {
        const subProgramas = this.serviciosService
          .listarSubProgramas(i_programa.idPrograma!)
          .subscribe((rtaSubProgramas) => {
            i_programa.subProgramas = rtaSubProgramas;

            //CARGAMOS LOS SERVICIOS DEL SUBPROGRAMA
            i_programa.subProgramas?.map((i_subPrograma: SubPrograma) => {
              const subProgramas = this.serviciosService
                .listarServicios(
                  i_programa.idPrograma!,
                  i_subPrograma.idSubPrograma!
                )
                .subscribe((rtaServicios) => {
                  i_programa.cant_servicios =
                    i_programa.cant_servicios + rtaServicios.length;
                  i_subPrograma.servicios = rtaServicios;
                  this.isLoadingEspecial = false
                  //END SERVICOS
                });
            });
          });
      });
    });
  }

  loadSubProgramas(idPrograma: string) {
    return this.serviciosService
      .listarSubProgramas(idPrograma)
      .subscribe((rta: Programa[]) => {
        console.log('rta for loadSubProgramas ', rta);
        return rta;
      });
  }

  loadServicios(idPrograma: string, idSubPrograma: string) {
    return this.serviciosService
      .listarServicios(idPrograma, idSubPrograma)
      .subscribe((rta: any) => {
        console.log('rta for loadServicios', rta);
        return rta;
      });
  }

  setLink2(nameLink: string, codigo: string) {
    this.breadcrumService.link2$.next({
      url: '/servicios/show/' + codigo,
      title: nameLink,
    });
    this.router.navigate(['/servicios/show/', codigo]);
  }

  getClassRow(i: number): string {
    let row = '';
    if (i % 2 != 0) row = 'rowColor';
    return row;
  }

  applyFilter(event: Event) {
    const searchTex = (event.target as HTMLInputElement).value;
    const results = this.programas.filter((pr)=> pr.descripcion === searchTex ).map((res) => res)

    console.log("  ---- "+results)

    Object.assign(this.programas, results)
    return results 
  }
}