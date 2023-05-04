import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import * as moment from 'moment';
import { RedesService } from 'src/app/core/_service/redes.service';
import { Red } from 'src/app/core/_model/red.model';

@Component({
  selector: 'app-edit-red',
  templateUrl: './edit-red.component.html',
  styleUrls: ['./edit-red.component.css'],
})
export class EditRedComponent {
  form = this.formBuilder.nonNullable.group({
    redasiscod: ['', [Validators.required, Validators.minLength(4)]],
    fechaInscripcion: ['', [Validators.required]],
    nombre: ['', [Validators.minLength(6), Validators.required]],
    direccion: ['', [Validators.required]],
    ubigeo: ['', [Validators.required, Validators.minLength(6)]],
    region: ['', [Validators.required]],
    celular: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    estado: ['', [Validators.required]],
  });

  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };

  status: RequestStatus = 'init';
  cantMinCaracterForBusqueda = 3;
  red: Red;
  cam: Cam;
  cams: Cam[];
  ubigeos: UbiGeo[];
  ubigeo: UbiGeo;
  id = '';
  updateRed: Red;
  regions: any[];
  region: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private camsService: CamsService,
    private http: HttpClient,
    private ubigeoService: UbiGeoService,
    private redService: RedesService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;

    //for breadcrum
    this.breadcrumService.link1$.next({
      url: '/cams/redes',
      title: 'REDES ESSALUD',
    });
    this.breadcrumService.link3$.next({
      url: '/cams/redes/edit/' + this.id,
      title: 'EDITAR',
    });
    this.breadcrumService.activeTab$.next('redes');
    this.loadRegions();
    this.loadUbigeos();
    this.loadRedById();
  }

  saveEditRed() {
    if (this.form.valid) {
      this.status = 'loading';
      const {
        nombre,
        redasiscod,
        region,
        celular,
        email,
        fechaInscripcion,
        direccion,
        estado,
      } = this.form.getRawValue();
      this.updateRed = {
        nombre,
        redasiscod,
        celular,
        tipo: '2',
        email,
        fechaInscripcion,
        direccion,
        ubigeo: this.ubigeo,
        region: this.region.idparametro,
        estado,
      };
      this.redService.actualizar(this.updateRed, parseInt(this.id)).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/cams/redes']);
        },
        error: () => {
          this.status = 'failed';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  loadRedById() {
    this.redService.listarPorId(parseInt(this.id)).subscribe((rta: any) => {
      console.log('rta from loadRedById...', rta);
      this.red = rta;
      this.breadcrumService.link2$.next({
        url: '/cams/redes/show/' + this.id,
        title: rta.nombre,
      });
      this.form.get('redasiscod')?.setValue(this.red?.redasiscod!);
      this.form.get('fechaInscripcion')?.setValue(this.red?.fechaInscripcion!);
      this.form.get('nombre')?.setValue(this.red?.nombre!);
      this.form.get('direccion')?.setValue(this.red?.direccion!);
      //this.form.get('ubigeo')?.setValue(this.red.ubigeo!);
      this.form.get('region')?.setValue(this.red?.region!);
      this.form.get('celular')?.setValue(this.red?.celular!);
      this.form.get('email')?.setValue(this.red?.email!);
      this.form.get('estado')?.setValue(this.red?.estado!);
    });
  }

  loadCams() {
    const tmp = this.camsService.listar().subscribe((rta: any) => {
      this.cams = rta;
    });
  }

  loadRegions() {
    this.redService.getParametrosClase('REGION').subscribe((rta: any) => {
      this.regions = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }

}
