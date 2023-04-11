import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { Programa } from 'src/app/core/_model/programa.model';
import { RequestStatus } from 'src/app/core/_model/request-status.model';
import { UbiGeo } from 'src/app/core/_model/ubigeo.model';
import { ProgramasService } from 'src/app/core/_service/programas.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-servicio',
  templateUrl: './new-servicio.component.html',
  styleUrls: ['./new-servicio.component.css'],
})
export class NewServicioComponent implements OnInit {
  subBreadcrum1: { url: string; title: string };
  subBreadcrum2: { url: string; title: string };
  subBreadcrum3: { url: string; title: string };
  status: RequestStatus = 'init';
  cam: Cam;
  cams: Cam[];
  ubigeos: UbiGeo[];
  ubigeo: UbiGeo;
  messageAlertSubPrograma:string = "";
  messageAlertServicio:string = "";

  newProgram: Programa;

  form = this.formBuilder.nonNullable.group({
    descAsignatura: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private breadcrumService: BreadcrumService,
    private programService: ProgramasService,
  ) {
    //for breadcrum
    this.breadcrumService.link1$.next({
      url: '/cams/servicios',
      title: 'SERVICIOS',
    });
    this.breadcrumService.link2$.next({
      url: '/cams/servicios/new',
      title: 'NUEVO SERVICIO',
    });
    this.breadcrumService.link3$.next({ url: '', title: '' });
    this.breadcrumService.activeTab$.next('servicios');

    //temporal, hasta que exista el endPoint CrearPrograma
      this.newProgram = new Programa();
      this.newProgram = { descripcion: "nuevo programa", cant_servicios:0 };
  }

  ngOnInit(): void {
  }

  saveProgram() {
    if (this.form.valid) {
      this.status = 'loading';
      const { descAsignatura } = this.form.getRawValue();
      this.newProgram = {
        descripcion: descAsignatura,
        cant_servicios:0
      };
      this.programService.registrar(this.newProgram).subscribe({
        next: (rta) => {
          this.newProgram.idPrograma = rta.idPrograma;
          this.newProgram.descripcion = rta.descripcion;
          this.status = 'success';
          this.router.navigate(['/cams/servicios']);
        },
        error: () => {
          this.status = 'failed';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  addSubPrograma() {
    if (  !this.newProgram.subProgramas )
    {
      this.newProgram.subProgramas = []
    }

    if ( this.newProgram && this.newProgram.subProgramas )
    {
      this.newProgram.subProgramas.push({"descripcion":"", "idFront":Math.random() })
    }
    else  console.log('addsubprograma... subprograma is UNDEFINED.  params.index: ');
  }

  delSubPrograma(idFront:number) {
    if ( this.newProgram && this.newProgram.subProgramas )
    {
      this.newProgram.subProgramas = this.newProgram.subProgramas.filter((item) => item.idFront !== idFront);
    }
    else  console.log('delsubprograma... subprograma is UNDEFINED.  params.index: ', idFront);
  }

  addServicio(indexSubPrograma: number) {

    if ( this.newProgram.subProgramas && !this.newProgram?.subProgramas[indexSubPrograma]?.servicios )
    {
      this.newProgram.subProgramas[indexSubPrograma].servicios= []
    }

    if ( this.newProgram && this.newProgram.subProgramas && this.newProgram.subProgramas[indexSubPrograma].servicios)
    {
      this.newProgram.subProgramas[indexSubPrograma].servicios?.push({"descripcion":"", "idFront":Math.random() })
    }
    else  console.log('addservicio... servicio is UNDEFINED.  params.index: ', indexSubPrograma);
  }

  delServicio(indexSubPrograma: number, idFront:number) {
    if ( this.newProgram && this.newProgram.subProgramas && this.newProgram?.subProgramas[indexSubPrograma])
    {
      this.newProgram.subProgramas[indexSubPrograma].servicios = this.newProgram.subProgramas[indexSubPrograma].servicios?.filter((item) => item.idFront !== idFront);
    }
    else  console.log('delservicio... servicio is UNDEFINED.  params.index: ', indexSubPrograma);
  }
}
