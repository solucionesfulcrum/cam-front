import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Cam } from 'src/app/core/_model/cam.model';
import { Red } from 'src/app/core/_model/red.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { CamsService } from 'src/app/core/_service/cams.service';
import { RedesService } from 'src/app/core/_service/redes.service';
import { UbiGeoService } from 'src/app/core/_service/ubigeo.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-cam',
  templateUrl: './new-cam.component.html',
  styleUrls: ['./new-cam.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCamComponent implements OnInit, OnDestroy {
  form = this.formBuilder.nonNullable.group({
    codigo: ['', [Validators.minLength(6), Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    //tipo: ['', [ Validators.required, Validators.minLength(8)]],
    celular: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    //fechaInscripcion: ['', [ Validators.required, Validators.pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/)]],
    fechaInscripcion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    red: ['', [Validators.required]],
    ubigeo: ['', [Validators.required, Validators.minLength(6)]],
    redFilterCtrl: [''],
  });

  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  newCam: Cam;
  cantMinCaracterForBusqueda = 3;
  redes: Red[];
  ubigeos: UbiGeo[];

  red: Red;
  filteredRed: Red[];
  isCargandoRed = false;

  ubigeo: UbiGeo;
  filteredUbigeo: UbiGeo[];
  isCargandoUbigeo = false;

  filteredRedes$ = new ReplaySubject<Red[]>(1);

  //TMP
  userTipo = 'admin';
  idPersona = '1';

  get formRedFilterCtrl() {
    return this.form.get('redFilterCtrl');
  }

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breadcrumService: BreadcrumService,
    private camService: CamsService,
    private redesService: RedesService,
    private ubigeoService: UbiGeoService,
    private ref: ChangeDetectorRef
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/cams', title: 'CAMS' });
    this.breadcrumService.link2$.next({ url: '/cams/new', title: 'NUEVO CAM' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('/cams');
    this.loadRedes();
    this.loadUbigeos();
  }

  ngOnInit(): void {}

  saveCam() {
    if (this.form.valid) {
      this.status = 'loading';
      const {
        codigo,
        descripcion,
        celular,
        email,
        fechaInscripcion,
        direccion,
      } = this.form.getRawValue();
      this.newCam = {
        codigo,
        descripcion,
        tipo: '1',
        celular,
        email,
        fechaInscripcion,
        direccion,
        estado: 1,
        red: this.red,
        ubigeo: this.ubigeo,
      };
      this.camService.registrar(this.newCam).subscribe({
        next: () => {
          this.status = 'success';
          this.router.navigate(['/cams']);
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
    this.formRedFilterCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.redes) {
          return;
        }
        let value = this.formRedFilterCtrl?.value;
        if (!value) {
          this.filteredRedes$.next(this.redes.slice());
          return;
        }
        value = value.toLowerCase();

        this.filteredRedes$.next(
          this.redes.filter(
            (red) => red.nombre.toLowerCase().indexOf(value as string) > -1
          )
        );
      });
  }

  clearSelectionRed() {
    this.red!;
    this.filteredRed = [];
    this.form.get('red')?.setValue('');
  }

  clearSelectionUbigeo() {
    this.ubigeo!;
    this.filteredUbigeo = [];
    this.form.get('ubigeo')?.setValue('');
  }

  displayWith(value: any) {
    if (value) return value;
    else return '';
  }

  displayWithUbigeo(value: any) {
    if (value) return value;
    else return '';
  }

  async onSelectedRed() {
    this.red = this.red;
    this.form.get('red')?.setValue(this.red?.nombres!);
  }

  async onSelectedUbigeo() {
    this.red = this.red;
    //this.ubigeo = this.red
    this.form.get('ubigeo')?.setValue(this.red?.nombres!);
  }

  loadRedes() {
    this.redesService.listar().subscribe((rta: any) => {
      this.redes = rta;
      this.filteredRedes$.next(rta.slice());
      this.filterRedCam();
    });
  }

  loadUbigeos() {
    this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
