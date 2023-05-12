import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Red } from 'src/app/core/_model/red.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-red',
  templateUrl: './new-red.component.html',
  styleUrls: ['./new-red.component.css'],
})
export class NewRedComponent {
  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  newRed: Red;
  regions: any[];
  region: any;
  cantMinCaracterForBusqueda = 3;
  ubigeos: UbiGeo[];
  filteredUbigeos$ = new ReplaySubject<UbiGeo[]>(1);
  ubigeo: UbiGeo;

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
    ubigeoFilterCtrl: [''],
  });

  get formUbigeoFilterCtrl() {
    return this.form.get('ubigeoFilterCtrl');
  }

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private redesService: RedesService,
    private http: HttpClient,
    private camsService: CamsService,
    private ubigeoService: UbiGeoService
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/cams/redes', title: 'REDES' });
    this.breadcrumService.link2$.next({
      url: '/cams/redes/new',
      title: 'NUEVA RED',
    });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('redes');
    this.loadUbigeos();
    this.loadRegions();
  }

  saveRed() {
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
      } = this.form.getRawValue();
      this.newRed = {
        nombre,
        redasiscod,
        celular,
        tipo: '2',
        email,
        fechaInscripcion,
        direccion,
        ubigeo: this.ubigeo,
        estado: '1',
        region: this.region.idparametro,
      };
      this.redesService.registrar(this.newRed).subscribe({
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

  filterUbigeo(): void {
    this.formUbigeoFilterCtrl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.ubigeos) {
          return;
        }
        let value = this.formUbigeoFilterCtrl?.value;
        if (!value) {
          this.filteredUbigeos$.next(this.ubigeos.slice());
          return;
        }
        value = value.toLowerCase();

        this.filteredUbigeos$.next(
          this.ubigeos.filter(
            (cm) => cm.descDis.toLowerCase().indexOf(value as string) > -1
          )
        );
      });
  }

  loadRegions() {
    this.redesService.getParametrosClase('REGION').subscribe((rta: any) => {
      this.regions = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }
}
