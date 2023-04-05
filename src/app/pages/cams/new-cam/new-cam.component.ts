import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
})
export class NewCamComponent implements OnInit {
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

  //TMP
  userTipo = 'admin';
  idPersona = '1';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breadcrumService: BreadcrumService,
    private camService: CamsService,
    private redesService: RedesService,
    private ubigeoService: UbiGeoService
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/cams', title: 'CAMS' });
    this.breadcrumService.link2$.next({ url: '/cams/new', title: 'NUEVO CAM' });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('/cams');

    this.loadRedes();
    this.loadUbigeos();
  }

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
    const tmp = this.redesService.listar().subscribe((rta: any) => {
      this.redes = rta;
    });
  }

  loadUbigeos() {
    const tmp = this.ubigeoService.listar().subscribe((rta: any) => {
      this.ubigeos = rta;
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
