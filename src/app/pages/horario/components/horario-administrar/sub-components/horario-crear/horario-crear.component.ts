import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HorarioAdministracionService } from '@services/horario/horario-administracion.service';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { Observable, map, startWith } from 'rxjs';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { ConfirmCreateHorarioComponent } from '../dialogs/confirm-create-horario/confirm-create-horario.component';
import { RequestCreateHorario, RequestCreateHorarioAdminis, RequestHorarioDetalle } from '@models/horario/horario.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { ContactoProfesionalesService } from '@services/contacto/contacto-profesionales.service';
import { Parametro } from '@shared/components/opciones-busqueda/parametros-busqueda.model';

@Component({
  selector: 'esp-horario-crear',
  templateUrl: './horario-crear.component.html',
  styleUrls: ['./horario-crear.component.scss']
})
export class HorarioCrearComponent {

  frmHorario = this.fb.nonNullable.group({
    frmMes:['', [Validators.required]],
    frmAnio:['', [Validators.required]],
  });
  
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;
  idUsuario = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;

  listaRegimenes: Parametro[] = [];
  opcionesRegimen: TablaOpciones[] = [/*{idOpcion: 1, nombre: 'Administrativo', value: 1}, {idOpcion: 2, nombre: 'Médico Rehabilitador', value: 2}, {idOpcion: 3, nombre: 'Psicólogo', value: 3}, {idOpcion: 4, nombre: 'Asistencial', value: 4}*/];
  dataColumnas: FormatoColumna[] = [
    {nomAttribute: 'idProfesional', oculto: true},
    {header: 'Profesionales', tipo: 'texto', nomAttribute: 'nomProfesional'},
    {header: 'Régimen', tipo: 'select', opciones: this.opcionesRegimen, nomAttribute: 'regimen'},
    {header: 'Horas x Mes', tipo: 'texto', nomAttribute: 'horasMes'},
    {header: 'Horas Vacaciones', tipo: 'inputNumber', nomAttribute: 'horasVacaciones'}
  ];

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Guardar nuevo horario', colorBtn:'mezclado', loading: false, esImagen: true, rutaIcono: 'assets/svg/icon-white-save.svg'},
  ];

  dataProfesionalEnviado = new FormControl();

  ctrlDataObtenida = new FormControl();
  
  ctrlUnidRehab = new FormControl();
  listUnidadesRehabilitacion: any[] = [];

  listProfesionales: any[] = [];
  ctrlProfesionalSeleccionado = new FormControl();
  profesionalnSeleccionadoTmp!: any;
  filteredOptionsProfesional!: Observable<any[]>;

  listMeses: any[] = [];
  meses: any[] = [
    {num: 1, descripcion: 'Enero'},
    {num: 2, descripcion: 'Febrero'},
    {num: 3, descripcion: 'Marzo'},
    {num: 4, descripcion: 'Abril'},
    {num: 5, descripcion: 'Mayo'},
    {num: 6, descripcion: 'Junio'},
    {num: 7, descripcion: 'Julio'},
    {num: 8, descripcion: 'Agosto'},
    {num: 9, descripcion: 'Setiembre'},
    {num: 10, descripcion: 'Octubre'},
    {num: 11, descripcion: 'Noviembre'},
    {num: 12, descripcion: 'Diciembre'},
  ];
  anios: string[] = [(new Date()).getFullYear().toString(),((new Date()).getFullYear()+1).toString(),((new Date()).getFullYear()+2).toString()];
  
  constructor(private router                          : Router,
              private notificationService             : NotificationService,
              private fb                              : FormBuilder,
              private dialog                          : Dialog,
              private datosGeneralesService           : DatosGeneralesService,
              private contactoProfesionalesService    : ContactoProfesionalesService,
              private horariosService                 : HorarioAdministracionService){}

  ngOnInit(){
    this.getDataServices();
    this.ctrlUnidRehab.valueChanges.subscribe((data)=>{
      this.contactoProfesionalesService.getListProfUnidadRehab(data,this.idUnidadOperativaUser).subscribe((lista)=>{
        this.listProfesionales = Array.from(lista.data.reduce((m: any, t: any) => m.set(t.nombres, t), new Map()).values()).sort((a: any, b: any) => a.profesionalId - b.profesionalId);
        console.log(this.listProfesionales)
        this.ctrlProfesionalSeleccionado.reset('');
      })
    })
    this.filteredOptionsProfesional = this.ctrlProfesionalSeleccionado.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombres),
      map(nombreProfesional => nombreProfesional ? this._filter(nombreProfesional) : this.listProfesionales.slice())
    );

    this.ctrlDataObtenida.valueChanges.subscribe((data)=>{
      data.data.forEach((datos: any)=>{
        if (datos.regimen) {
          datos.horasMes = (parseInt(this.listaRegimenes.find((x) => x.idParametros == datos.regimen)!.valor1));
        }
      })
    })
  }

  // SelectPersona---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  private _filter(value: string): any[] {
    if (value != undefined) {
      return this.listProfesionales.filter(unidRehab => unidRehab.nombres.toLowerCase().includes(value.toLowerCase()));
    }
    return this.listProfesionales;
  }
  displayFnProfesional(selectedoption: any) {
    return selectedoption ? selectedoption.nombres : undefined;
  }
  onSelectionChangeProfesional(event: any) {
    this.profesionalnSeleccionadoTmp = event.option.value;
    console.log(this.profesionalnSeleccionadoTmp)
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  getDataServices(){
    this.datosGeneralesService.getListaMeses().subscribe((data)=>{
      if (data.code == 0) {
        this.listMeses = data.data.sort((m1: any, m2: any) => m1.mesId - m2.mesId);
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.horariosService.getListUnidadesRehab().subscribe((data)=>{
      if (data.code == 0) {
        console.log(data)
        this.listUnidadesRehabilitacion = (data.data)
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
    this.datosGeneralesService.getTipoParametros('PROFESIONAL_REGIMEN').subscribe((data)=>{
      if (data.code == 0) {
        this.listaRegimenes = data.data;
        data.data.forEach((x)=>{
          this.opcionesRegimen.push({idOpcion: x.idParametros, nombre: x.nombre, value: x.idParametros})
        })
        console.log(data.data)
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  funcionesExtra(opt: number){
    switch (opt) {
      case 0:
        this.router.navigate([`/app/${AppRoute.HORARIOS}`]);
        break;
      case 1:
        // console.log(this.getHorario())
        if (this.frmHorario.valid && this.ctrlDataObtenida.value.data.length > 0) {
          if (this.ctrlDataObtenida.value.data.some((item: any)=> item.regimen == null)) {
            this.notificationService.warning("Complete los datos del régimen de los profesionales")
          }
          else{
            const dialogRef = this.dialog.open(ConfirmCreateHorarioComponent,{
              data:{
                horario: this.getHorario(),
                obj: this.getDatos()
                // numHist: this.activeRoute.snapshot.paramMap.get('numHist')
              }
            })
          }
        }
        else{
          this.notificationService.warning("Complete los campos de mes, año y los profesionales")
        }
        break;
    }
  }

  // funcPruebas(){
  //   this.dataColumnas.push({header: 'prueba', tipo: 'inputNumber', nomAttribute: 'prueba'});
  // }

  showEnter(){
    if (this.profesionalnSeleccionadoTmp) {
        if (this.ctrlDataObtenida.value && this.ctrlDataObtenida.value.data.find((x: any) => {return x.idProfesional == this.profesionalnSeleccionadoTmp.profesionalId})){
          this.notificationService.warning('Este profesional ya fue asignado');
        }
        else{
          this.dataProfesionalEnviado.setValue({idProfesional: this.profesionalnSeleccionadoTmp.profesionalId, nomProfesional: this.profesionalnSeleccionadoTmp.nombres, regimen: this.profesionalnSeleccionadoTmp.regimenId, horasMes: this.profesionalnSeleccionadoTmp.horasMensuales ? this.profesionalnSeleccionadoTmp.horasMensuales : 0, horasVacaciones: 0})
          this.dataProfesionalEnviado.setValue(null)
        }
        this.profesionalnSeleccionadoTmp = null;
        this.ctrlProfesionalSeleccionado.reset('');
      
    }
  }

  aniadirTodos(){
    if (this.ctrlDataObtenida.value){
      for (let i = 0; i < this.listProfesionales.length; i++) {
        if (!this.ctrlDataObtenida.value.data.find((x: any) => {return x.idProfesional == this.listProfesionales[i].profesionalId})){
          this.dataProfesionalEnviado.setValue({idProfesional: this.listProfesionales[i].profesionalId, nomProfesional: this.listProfesionales[i].nombres, regimen: this.listProfesionales[i].regimenId, horasMes: this.listProfesionales[i].horasMensuales ? this.listProfesionales[i].horasMensuales : 0, horasVacaciones: 0})
        }
      }
    }
    else{
      for (let i = 0; i < this.listProfesionales.length; i++) {
        this.dataProfesionalEnviado.setValue({idProfesional: this.listProfesionales[i].profesionalId, nomProfesional: this.listProfesionales[i].nombres, regimen: this.listProfesionales[i].regimenId, horasMes: this.listProfesionales[i].horasMensuales ? this.listProfesionales[i].horasMensuales : 0, horasVacaciones: 0})
      }
    }
  }

  getDatos(): RequestCreateHorario{
    return{
      mes: this.frmHorario.controls.frmMes.value,
      anio: this.frmHorario.controls.frmAnio.value,
      listPorfesionales: this.ctrlDataObtenida.value.data
    }
  }

  getHorario(): RequestCreateHorarioAdminis{
    let listProfesionales: RequestHorarioDetalle[] = [];
    this.ctrlDataObtenida.value.data.forEach((x: any) => {
      listProfesionales.push({profesionalId: x.idProfesional, paramRegimenId: parseInt(x.regimen), horasXMes: x.horasMes, horasVacaciones: x.horasVacaciones})
    });
    return{
      mesId: parseInt(this.frmHorario.controls.frmMes.value),
      anio: parseInt(this.frmHorario.controls.frmAnio.value),
      usuarioId: this.idUsuario,
      unidOperativaId: this.idUnidadOperativaUser,
      horarioDet: listProfesionales
    }
  }
}
