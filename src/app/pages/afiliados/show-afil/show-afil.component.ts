import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { AuthService } from '../../auth/services/auth-service.service';
import { ModalActivarAfilComponent } from './modalActivar/modal-activar-afil.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/core/_service/usuario.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-show-afil',
  templateUrl: './show-afil.component.html',
  styleUrls: ['./show-afil.component.css']
})
export class ShowAfilComponent implements OnInit {
  user: any;
  subLinks = [{ url: '', title: '' }];

  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  subActiveTab = '/show';

  form1 = this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  //sid = this.route.snapshot.paramMap.get('sid')
  id = '';
  name = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService,
    private authService: AuthService,
    private dialog: MatDialog,
    private usuariosService: UsuarioService,
    
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subLinks[0] = {
      url: '/afiliados/show/' + this.id + '/operaciones',
      title: 'Operaciones',
    };

    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/afiliados', title: 'AFILIADOS' });
    //this.loadUserById(this.id); //carga datos reales del servidor
    this.loadUserByIdFromSys(this.id); //carga datos reales del servidor
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('/afiliados');

    breadcrumService.subLink1$.subscribe((event) => {
      this.subBreadcrum1 = event;
    });

    breadcrumService.subLink2$.subscribe((event) => {
      this.subBreadcrum2 = event;
    });

    breadcrumService.subLink3$.subscribe((event) => {
      this.subBreadcrum3 = event;
    });

    breadcrumService.subActiveTab$.subscribe((event) => {
      this.subActiveTab = event;
    });
  }

  ngOnInit(): void {}

  loadUserById(id: string) {
    const tmp = this.authService
      .getUserInfoSessionFromSSO(1, 20)
      .subscribe((rta: any) => {
        this.user = rta;
        console.log('User sesion... ', rta);
        this.breadcrumService.link2$.next({
          url: '/afiliados/show/' + this.id,
          title: rta.nombres,
        });
      });
  }

  loadUserByIdFromSys(id: string) {
    const tmp = this.usuariosService
      .getUsuarioFromSys(this.id)
      .subscribe((rta: any) => {
        this.user = rta;
        console.log('User sesion from sys... ', rta);
        this.breadcrumService.link2$.next({
          url: '/afiliados/show/' + this.id,
          title: rta.nombres,
        });
      });
  }

  loadModalActivarUsuario() {
    const dialogRef = this.dialog.open(ModalActivarAfilComponent, {
      width: '1050px',
      height: 'auto',
      data: { user: this.user, guiid: this.id },
    });
    dialogRef.afterClosed().subscribe((rta: any) => {
      console.log('resul post modal from parent: ', rta);
    });
  }

}

