import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroUsuario } from 'src/app/core/_model/auth/registro';
import { RegistroCodigoComponent } from '../modals/registro-codigo/registro-codigo.component';
import { AuthService } from '../services/auth-service.service';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit, AfterViewInit, OnDestroy {
  registroForm = this.fb.group({
    tipoDocumentoCtrl: ['', [Validators.required]],
    nroDocumentoCtrl: ['', [Validators.required]],
    codigoPlanCtrl: [''],
    correoCtrl: ['', [Validators.required, Validators.email]],
    nombresCtrl: ['', [Validators.required]],
    passwordCtrl: ['', [Validators.required]],
    confirmPasswordCtrl: ['', [Validators.required]],
    accept: ['', [Validators.required]],
    cam: ['', [Validators.required]],
  });

  cams: Cam[];
  cam: Cam;
  hide = true;
  hide2 = true;
  loading: boolean;
  accept = false;

  camCtrl: FormControl<Cam | null> = new FormControl<Cam>(null!);
  camFilterCtrl: FormControl<string | null> = new FormControl<string>('');
  filteredCams: ReplaySubject<Cam[]> = new ReplaySubject<Cam[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService,
    private dialog: MatDialog,
    private camsService: CamsService
  ) {
    this.loadCams();
  }

  ngAfterViewInit(): void {
    this.setInitialValue();
  }

  ngOnInit(): void {
    // listen for search field value changes
    this.camFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCams();
      });
  }

  registrarUsuario(): void {
    this.loading = true;
    const formValue = this.registroForm.value;
    const DATA: RegistroUsuario = {
      tipDocIden: formValue.tipoDocumentoCtrl,
      numDocIden: formValue.nroDocumentoCtrl,
      password: formValue.passwordCtrl,
      email: formValue.correoCtrl,
      nombres: formValue.nombresCtrl,
      codigoPlanilla: formValue.codigoPlanCtrl,
      accept: formValue.accept ? true : false,
      cam: this.cam,
    };
    this.authSvc.registrarUsuario(DATA).subscribe({
      next: (resp) => {
        console.log('RESP', resp);
        if (resp.charAt(0) === '{') {
          const respJson = JSON.parse(resp);
          this.toastrSvc.warning(respJson.message);
        } else {
          this.abrirModalRegistro(resp, DATA.email as string);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  abrirModalRegistro(guiid: string, email: string): void {
    const data = {
      guiid,
      email,
    };
    const dialog = this.dialog.open(RegistroCodigoComponent, {
      data: { title: 'Completar Registro', data },
      width: '450px',
      disableClose: true,
    });
    dialog.afterClosed().subscribe();
  }

  volverLogin(): void {
    this.router.navigate(['/']);
  }

  loadCams() {
    const tmp = this.camsService.listar().subscribe((rta: any) => {
      this.cams = rta;
      this.camCtrl.setValue(this.cams[1]);
      this.filteredCams.next(this.cams?.slice());
    });
  }

  onCheckBox(event: any) {
    if (event.checked === true) {
      this.registroForm.controls.accept.setValue('true');
      console.log('si...', event);
    } else {
      this.registroForm.controls.accept.setValue('');
      console.log('no..', event);
    }
  }

  filterCams() {
    if (!this.cams) {
      return;
    }
    // get the search keyword
    let search = this.camFilterCtrl.value;
    if (!search) {
      this.filteredCams.next(this.cams.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCams.next(
      this.cams.filter(
        (cam) => cam.descripcion.toLowerCase().indexOf(search!) > -1
      )
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredCams
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Cam, b: Cam) =>
          a && b && a.codigo === b.codigo;
      });
  }
}