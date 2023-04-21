import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';
import { FormBuilder } from '@angular/forms';
import { CamsService } from 'src/app/core/_service/cams.service';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Location } from '@angular/common';
import { HelpperService } from 'src/app/shared/services/helpper.service';
import { Programa } from 'src/app/core/_model/programa.model';


@Component({
  selector: 'app-show-programacion-taller',
  templateUrl: './show-programacion-taller.component.html',
  styleUrls: ['./show-programacion-taller.component.css'],
})
export class ShowProgramacionTallerComponent implements OnInit {
  uo: Cam | Ciram | Programa | null;
  list_uo: any[] 

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
    private hellperService:HelpperService,
    private camsService: CamsService,
  ) {
    console.log("constructor show programacion")
    this.id = this.route.snapshot.paramMap.get('id')!;
    //this.subLinks[0]={url:'/talleres/programacion/show/'+this.id, title:this.cam.descripcion }

    //for breadcrum
    this.breadcrumService.link1$.next({ url: '/talleres/programacion', title: 'BBBBPROGRAMACIÓN', });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.loadCamById(this.id); //carga datos reales del servidor
    this.breadcrumService.activeTab$.next('programacion');

    
    hellperService.uo$.subscribe((event) => {
      this.uo = event;
    });

    hellperService.list_uo$.subscribe((event) => {
      this.list_uo = event;
    });

  }

  ngOnInit(): void {
    
  }

  async loadCamById(id: string) {
    this.camsService
      .listarPorId(parseInt(this.id))
      .subscribe((rta: any) => {
        this.uo= rta;
        this.breadcrumService.link2$.next({
          url: '/talleres/programacion/' + this.id,
          title: rta.descripcion,
        });
      });
  }

 
}


