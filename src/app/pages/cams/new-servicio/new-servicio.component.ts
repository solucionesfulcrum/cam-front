import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Programa } from 'src/app/core/_model/programa.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { ProgramasService } from 'src/app/core/_service/programas.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-servicio',
  templateUrl: './new-servicio.component.html',
  styleUrls: ['./new-servicio.component.css'],
})
export class NewServicioComponent implements OnInit {
  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  cam: Cam;
  cams: Cam[];
  ubigeos: UbiGeo[];
  ubigeo: UbiGeo;

  newProgram: Programa;
  idProgram: Programa;
  idSubPrograma: Programa;
  programs: Programa[];

  form = this.formBuilder.nonNullable.group({
    idAsignatura: ['', [Validators.minLength(6), Validators.required]],
    codAsignatura: ['', [Validators.minLength(6), Validators.required]],
    descAsignatura: ['', [Validators.required, Validators.minLength(8)]],
    nivel: ['', [Validators.minLength(2), Validators.required]],
    idPrograma: ['', [Validators.required]],
    idSubPrograma: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private programService: ProgramasService,
    private camsService: CamsService,
    private ubigeoService: UbiGeoService,
    private http: HttpClient
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({
      url: '/cams/servicios',
      title: 'SERVICIOS',
    });
    this.breadcrumService.link2$.next({
      url: '/cams/servicios/new',
      title: 'NUEVO SERVICIO',
    });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('servicios');
  }

  ngOnInit(): void {
    this.loadCams();
    this.loadUbigeos();
  }

  saveProgram() {
    if (this.form.valid) {
      this.status = 'loading';
      const { idAsignatura, codAsignatura, descAsignatura, nivel } =
        this.form.getRawValue();
      this.newProgram = {
        idAsignatura: parseInt(idAsignatura),
        codAsignatura,
        descAsignatura,
        nivel: parseInt(nivel),
        idPrograma: this.idProgram,
        idSubPrograma: this.idSubPrograma,
      };
      this.programService.registrar(this.newProgram).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/cams/servicios']);
        },
        error: () => {
          this.status = 'failed';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  loadCams() {
    const tmp = this.camsService.listar().subscribe((rta: any) => {
      this.cams = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }
}
