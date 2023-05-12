import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
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
export class NewCiramComponent implements OnInit {

    /** list of banks */
  protected cams: Cam[] = [];

  /** control for the selected bank */
  public camCtrl: FormControl<Cam | null > = new FormControl<Cam>(null!);

  /** control for the MatSelect filter keyword */
  public camFilterCtrl: FormControl<string | null> = new FormControl<string>('');

  /** list of banks filtered by search keyword */
  public filteredCams: ReplaySubject<Cam[]> = new ReplaySubject<Cam[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  newCiram: Ciram;
  cantMinCaracterForBusqueda = 3;
  //cams: Cam[];
  ubigeos: UbiGeo[];
  cam: Cam;
  ubigeo: UbiGeo;

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
  });

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

    this.loadCams();
    //this.loadUbigeos();
  }

  ngOnInit(): void {

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

  loadCams() {
    this.camsService.listar().subscribe((rta: any) => {
      console.log("rta: ", rta)
        this.cams = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }
}
