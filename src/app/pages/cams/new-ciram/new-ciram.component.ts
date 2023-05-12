import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-ciram',
  templateUrl: './new-ciram.component.html',
  styleUrls: ['./new-ciram.component.css'],
})
export class NewCiramComponent implements OnInit, OnDestroy {
  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  newCiram: Ciram;
  cantMinCaracterForBusqueda = 3;
  cams!: Cam[];
  ubigeos: UbiGeo[];
  cam: Cam;
  ubigeo: UbiGeo;

  filteredCams$ = new ReplaySubject<Cam[]>(1);
  filteredUbigeos$ = new ReplaySubject<UbiGeo[]>(1);

  form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(6), Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(8)]],
    celular: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', [Validators.required]],
    cam: ['', [Validators.required]],
    ubigeo: ['', [Validators.required, Validators.minLength(6)]],
    camFilterCtrl: [''],
    ubigeoFilterCtrl: [''],
  });

  get formCamFilterCtrl() {
    return this.form.get('camFilterCtrl');
  }

  get formUbigeoFilterCtrl() {
    return this.form.get('ubigeoFilterCtrl');
  }

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private ciramService: CiramsService,
    private http: HttpClient,
    private camsService: CamsService,
    private ubigeoService: UbiGeoService
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/cams/cirams', title: 'CIRAMS' });
    this.breadcrumService.link2$.next({
      url: '/cams/cirams/new',
      title: 'NUEVO CIRAM',
    });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('cirams');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.loadCams();
    this.loadUbigeos();
  }

  saveCiram() {
    if (this.form.valid) {
      this.status = 'loading';
      const { codigo, descripcion, celular, email, direccion } =
        this.form.getRawValue();
      this.newCiram = {
        codigo,
        descripcion,
        tipo: '2',
        celular,
        email,
        direccion,
        estado: 1,
        cam: this.cam,
        ubigeo: this.ubigeo,
      };
      this.ciramService.registrar(this.newCiram).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/cams/cirams']);
        },
        error: () => {
          this.status = 'failed';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  filterRedCam(): void {
    this.formCamFilterCtrl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.cams) {
          return;
        }
        let value = this.formCamFilterCtrl?.value;
        if (!value) {
          this.filteredCams$.next(this.cams.slice());
          return;
        }
        value = value.toLowerCase();

        this.filteredCams$.next(
          this.cams.filter(
            (cm) => cm.descripcion.toLowerCase().indexOf(value as string) > -1
          )
        );
      });
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

  loadCams() {
    this.camsService.listar().subscribe((rta: any) => {
      this.filteredCams$.next(rta.slice());
      this.filterRedCam();
      this.cams = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
      this.filteredUbigeos$.next(rta.slice());
      this.filterUbigeo();
    });
  }
}
