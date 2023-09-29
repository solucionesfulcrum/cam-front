import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { AfiliadoService } from '@shared/services/afiliado.service';
import { AfiliadosComponent } from '../afiliados/afiliados.component';
import { EvaluacionComponent } from '../evaluacion/evaluacion.component';
import { Dialog } from '@angular/cdk/dialog';
import { NotasAfilComponent } from '../components/notas-afil/notas-afil.component';

// import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { CamsService } from 'src/app/core/_service/cams.service';
// import { Cam } from 'src/app/core/_model/cam.model';
// import { AuthService } from '../../auth/services/auth-service.service';
// import { ModalActivarAfilComponent } from './modalActivar/modal-activar-afil.component';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { UsuarioService } from 'src/app/core/_service/usuario.service';
// import { MatCardModule } from '@angular/material/card';


export interface direccionData {
  estadoEnvio?: number;
  nombreDireccion: string;
  direccion: string;
  piso: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

@Component({
  selector: 'app-show-afil',
  templateUrl: './show-afil.component.html',
  styleUrls: ['./show-afil.component.css']
})
export class ShowAfilComponent implements OnInit {
  show= false;
  dataFicha: any = [''];
  dataAsegurado: any = [''];
  idFicha: string;

  edadPersona: number = 0;
  selectSi = false;
  selectNo = false;
  requiereApoyo: boolean = false;
  parentesco: string = '';
  tipoDocAcomp: string = '';

  /*direcciones: direccionData[] = [{estadoEnvio:1, nombreDireccion: 'Datos RENIEC', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''},
  {estadoEnvio:1, nombreDireccion: 'Casa', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''}]; */

  direcciones: direccionData[] = [{estadoEnvio:1, nombreDireccion: 'Casa', direccion: '', piso: '', distrito: '', provincia: '', departamento: ''}];

  formContacto = this.fb.nonNullable.group({
    frmTelefono:[''],
    frmCelular:[''],
    frmCorreo:[''],
    frmObservacion:['']
  });
  //-----

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog : Dialog,
    private _afiliaddoService: AfiliadoService ) {
    this.idFicha=this.activeRoute.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this._afiliaddoService.getFicha(this.idFicha).subscribe((data : any)=>{
      const dataObj = Object(data);
      this.dataFicha = dataObj.data;
      this.dataAsegurado = dataObj.data.asegurado
      //Obtener datos de direccion reniec
      var dateParts = this.dataAsegurado.fecNacimiento.split("-");
      var dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[1]); 
      var timeDiff = Math.abs(Date.now() - dateObject.getTime());
      this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
/*      this.direcciones[0].direccion = dataObj.data.asegurado.direccionActual;
      this.direcciones[0].distrito = dataObj.data.asegurado.distriActual;
      this.direcciones[0].provincia = dataObj.data.asegurado.provinActual;
      this.direcciones[0].departamento = dataObj.data.asegurado.departActual;
      //Obtener datos de direccion casa
      this.direcciones[1].direccion = dataObj.data.asegurado.direccDomicilio;
      this.direcciones[1].distrito = dataObj.data.asegurado.distriDomicilio;
      this.direcciones[1].provincia = dataObj.data.asegurado.provinDomicilio;
      this.direcciones[1].departamento = dataObj.data.asegurado.departDomicilio;
*/
      //Obtener datos de direccion casa
      this.direcciones[0].direccion = dataObj.data.asegurado.direccDomicilio;
      this.direcciones[0].distrito = dataObj.data.asegurado.distriDomicilio;
      this.direcciones[0].provincia = dataObj.data.asegurado.provinDomicilio;
      this.direcciones[0].departamento = dataObj.data.asegurado.departDomicilio;

      this.formContacto = this.fb.nonNullable.group({
        frmTelefono:[{value: dataObj.data.asegurado.telefRefer, disabled:true}],
        frmCelular:[{value: dataObj.data.asegurado.telefWhatsapp, disabled:true}],
        frmCorreo:[{value: dataObj.data.asegurado.correoRefer, disabled:true}],
        frmObservacion:[{value: dataObj.data.observacion, disabled:true}]
      });

      if(dataObj.data.asegurado.tieneAcomp === 'SI'){
        this.selectSi = true;
        this.requiereApoyo = true;
        this._afiliaddoService.getTipoParametros('PARENTESCO').subscribe((data)=>{
          this.parentesco = data.data.find((x)=> x.idParametros == dataObj.data.asegurado.codParentAcomp)?.nombre!;
        })
        this._afiliaddoService.getTipoParametros('TIPO_DOCUMENTO_IDENTIDAD').subscribe((data)=>{
          this.tipoDocAcomp = data.data.find((x)=> x.valor1 == dataObj.data.asegurado.tipDocIdentAcomp)?.nombre!;
        })
      }
      else{
        this.selectNo = true;
      }

      console.log(data);
    });
  }
  Imprimir(){
    window.print()
  }

  ActualizDatos(){
    
    this.router.navigate(['/afiliados/agregaEval'])

    // const dialogRef = this.dialog.open(NewEvalAfiliadoComponent,{
    //   minWidth:'800px',
    //   maxWidth:'50%',
    //   data:{}
    // })
    // dialogRef.closed.subscribe(out =>{
    //   // console.log(out)
    // })
  }

  Notas(){
    const dialogRef = this.dialog.open(NotasAfilComponent,{
      minWidth:'800px',
      maxWidth:'50%',        
      data:{}
    })
    dialogRef.closed.subscribe(out =>{
      // console.log(out)
    })
  }




  // user: any;
  // subLinks = [{ url: '', title: '' }];

  // subBreadcrum1: { url: string; title: string };
  // subBreadcrum2: { url: string; title: string };
  // subBreadcrum3: { url: string; title: string };
  // subActiveTab = '/show';

  // form1 = this.fb.group({
  //   fechaIni: [''],
  //   fechaFin: [''],
  // });

  // //sid = this.route.snapshot.paramMap.get('sid')
  // id = '';
  // name = '';

  // constructor(
  //   private router: Router,
  //   private fb: FormBuilder,
  //   private route: ActivatedRoute,
  //   private breadcrumService: BreadcrumService,
  //   private authService: AuthService,
  //   private dialog: MatDialog,
  //   private usuariosService: UsuarioService,
    
  // ) {
  //   this.id = this.route.snapshot.paramMap.get('id')!;
  //   this.subLinks[0] = {
  //     url: '/afiliados/show/' + this.id + '/operaciones',
  //     title: 'Operaciones',
  //   };

  //   //for breadcrum
  //   this.breadcrumService.link1$.next({ url: '/afiliados', title: 'AFILIADOS' });
  //   //this.loadUserById(this.id); //carga datos reales del servidor
  //   this.loadUserByIdFromSys(this.id); //carga datos reales del servidor
  //   this.breadcrumService.link3$.next({ url: '', title: '' });
  //   this.breadcrumService.activeTab$.next('/afiliados');

  //   breadcrumService.subLink1$.subscribe((event) => {
  //     this.subBreadcrum1 = event;
  //   });

  //   breadcrumService.subLink2$.subscribe((event) => {
  //     this.subBreadcrum2 = event;
  //   });

  //   breadcrumService.subLink3$.subscribe((event) => {
  //     this.subBreadcrum3 = event;
  //   });

  //   breadcrumService.subActiveTab$.subscribe((event) => {
  //     this.subActiveTab = event;
  //   });
  // }

  // ngOnInit(): void {}

  // loadUserById(id: string) {
  //   const tmp = this.authService
  //     .getUserInfoSessionFromSSO(1, 20)
  //     .subscribe((rta: any) => {
  //       this.user = rta;
  //       console.log('User sesion... ', rta);
  //       this.breadcrumService.link2$.next({
  //         url: '/afiliados/show/' + this.id,
  //         title: rta.nombres,
  //       });
  //     });
  // }

  // loadUserByIdFromSys(id: string) {
  //   const tmp = this.usuariosService
  //     .getUsuarioFromSys(this.id)
  //     .subscribe((rta: any) => {
  //       this.user = rta;
  //       console.log('User sesion from sys... ', rta);
  //       this.breadcrumService.link2$.next({
  //         url: '/afiliados/show/' + this.id,
  //         title: rta.nombres,
  //       });
  //     });
  // }

  // loadModalActivarUsuario() {
  //   const dialogRef = this.dialog.open(ModalActivarAfilComponent, {
  //     width: '1050px',
  //     height: 'auto',
  //     data: { user: this.user, guiid: this.id },
  //   });
  //   dialogRef.afterClosed().subscribe((rta: any) => {
  //     console.log('resul post modal from parent: ', rta);
  //   });
  // }

}

