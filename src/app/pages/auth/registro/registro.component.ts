import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroUsuario } from 'src/app/core/_model/auth/registro';
import { RegistroCodigoComponent } from '../modals/registro-codigo/registro-codigo.component';
import { AuthService } from '../services/auth-service.service';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { ReplaySubject, Subject, debounceTime, distinctUntilChanged, filter, finalize, switchMap, take, takeUntil, tap } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    unidadOperativaCtrl: ['', [Validators.required]],
  });

  cams: Cam[];
  cam: Cam;
  hide = true;
  hide2 = true;
  loading: boolean;
  accept = false;

  unidadOperativa: any;
  filterUnidadOperativas: any;
  isCargando= false;
  errorMsg:string;

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
    private camsService: CamsService,
    private http: HttpClient,
  ) {
    this.loadCams();
  }

  ngAfterViewInit(): void {
    this.setInitialValue();
  }

  ngOnInit(): void {
    // listen for search field value changes
    /*this.camFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCams();
      });*/


      /*this.registroForm
      .get('cam')
      ?.valueChanges.pipe(
        filter((res) => {
          return res !== null && res?.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';
          this.filterUnidadOperativas = [];
          this.isCargando = true;
        }),
        switchMap((value) =>
          this.http
            .get(environment.HOST + '/red/texto2/' + value)
            .pipe(
              finalize(() => {
                this.isCargando = false;
              })
            )
        )
      )
      .subscribe((data: any) => {
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.filterUnidadOperativas= [];
        } else {
          this.errorMsg = '';
          this.filterUnidadOperativas= data;
        }
      });*/

      this.authSvc.getUnidadesOperativas().subscribe((rta: any) => {
        this.unidadOperativa = rta.data;
        console.log(this.unidadOperativa)
      });
  }

  registrarUsuario(): void {
    console.log("aqui estamos 2"
    )
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
      unidadOperativa: formValue.unidadOperativaCtrl,
    };
    console.log("aqui estamos 2",DATA)
    console.log("aqui estamos 2",DATA.unidadOperativa)
    
    this.authSvc.registrarUsuario(DATA).subscribe({
      next: (resp) => {
        const respJson = JSON.parse(resp);
        console.log("servicio resp",respJson)
        if (respJson.code === 2){
          this.toastrSvc.warning(respJson.message,"Mensaje:");
        }
        if (respJson.data.charAt(0) === '{') {
          console.log("servicio ya existe",respJson.data)
          this.toastrSvc.warning(respJson.data.split('"')[3],"Mensaje:");
        } else {
          this.abrirModalRegistro(respJson.data, DATA.email as string, DATA.unidadOperativa, DATA.tipDocIden!, DATA.numDocIden!, DATA.nombres!, DATA.codigoPlanilla!);
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

  abrirModalRegistro(guiid: string, email: string, idUnidadOperativa:any, tipoDoc:string, numDoc:string, nombres:string, codPlanilla:string): void {
    

    const data = {
      guiid,
      email,
      tipoDoc,
      numDoc,
      unidadOperativa: idUnidadOperativa,
      nombres,
      codPlanilla
    };

    console.log("data registro", data)
    
    const dialog = this.dialog.open(RegistroCodigoComponent, {
      data: { title: 'Confirmar correo del Usuario', data },
      width: '535px',
      /*width: '450px',*/
      disableClose: true,
      panelClass:'custom-dialog-container',
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
    } else {
      this.registroForm.controls.accept.setValue('');
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
    //this.filteredCams
     // .pipe(take(1), takeUntil(this._onDestroy))
     // .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
      //  this.singleSelect.compareWith = (a: Cam, b: Cam) =>
      //    a && b && a.codigo === b.codigo;
      //});
  }

  clearSelection() {
    this.unidadOperativa = '';
    this.filterUnidadOperativas = [];
  }

  async onSelected() {
    this.unidadOperativa= this.unidadOperativa;
  }

  displayWith(value: any) {
    return value?.nombre;
  }

}
