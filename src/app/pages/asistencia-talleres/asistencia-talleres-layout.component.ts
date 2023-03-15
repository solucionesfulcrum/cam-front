import { DialogConfirmacionComponent } from '../../shared/dialog-confirmacion/dialog-confirmacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Parametro } from '../../core/_model/parametro';
import { ParametroService } from '../../core/_service/parametro.service';
import { AsistenciaService } from '../../core/_service/asistencia.service';
import { Asistencia } from '../../core/_model/asistencia';
import { UnidadOperativaService } from '../../core/_service/unidad-operativa.service';
import { Asegurado } from '../../core/_model/asegurado';
import { AseguradoService } from '../../core/_service/asegurado.service';
import { TallerHorariosDet } from '../../core/_model/taller-horarios-det';
import { TallerHorariosDetService } from '../../core/_service/taller-horarios-det.service';
import { BuscarTallerCabDTO } from '../../core/_DTO/buscar-taller-cab-dto';
import { TallerHorariosCabService } from '../../core/_service/taller-horarios-cab.service';
import { PersonaService } from '../../core/_service/persona.service';
import { Persona } from '../../core/_model/persona';
import { Talleres } from '../../core/_model/talleres';
import { TalleresService } from '../../core/_service/talleres.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-asistencia-talleres-layout',
    templateUrl: './asistencia-talleres-layout.component.html',
    styleUrls: ['./asistencia-talleres-layout.component.css']
  })
  export class AsistenciaTalleresLayoutComponent implements OnInit {

  displayedColumns: string[] = [
    'numero',
    'tipoDoc',
    'numDoc',
    'nombre',
    'acciones'
  ];

  talleres: Talleres[];
  talleristas: Persona[];
  tipoDocumento: Parametro[];
  tallerDetHoras: TallerHorariosDet[];
  asegurados: Asegurado[] = [];
  asistencias: Asistencia[] = [];

  aseguradoEncontrado: Asegurado
  nombreApellido: string;

  dataSource: MatTableDataSource<Asistencia> = new MatTableDataSource<Asistencia>(this.asistencias)

  formDatosTallerista: FormGroup;
  formAsegurado: FormGroup;
  formTallerDet: FormGroup;


  constructor(
    private _formBuilder: FormBuilder,
    private _talleresService: TalleresService,
    private _personaService: PersonaService,
    private _unidadOperativaService: UnidadOperativaService,
    private _tallerHorariosCabService: TallerHorariosCabService,
    private _tallerHorariosDetService: TallerHorariosDetService,
    private _parametroService: ParametroService,
    private _aseguradoService: AseguradoService,
    private _asistenciaService: AsistenciaService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.firstForm();
    this.listarTalleres();
    this.listarTalleristas();
    this.listarTipoDocumento();
  }

  firstForm() {
    this.formDatosTallerista = this._formBuilder.group({
      tallerista: [null, [Validators.required]],
      taller: [null, [Validators.required]],
      modalidad: [{ value: null, disabled: true }],
      fechaRegistro: [new Date(), [Validators.required]],
    });

    this.formTallerDet = this._formBuilder.group({
      horaTaller: [null, [Validators.required]]
    });

    this.formAsegurado = this._formBuilder.group({
      tallerDet: [null, [Validators.required]],
      tipoDoc: [null, [Validators.required]],
      numDoc: [null, [Validators.required]],
      asegurado: [null, [Validators.required]]
    });
  }

  listarTalleristas() {
    this._personaService.listar().subscribe(data => {
      this.talleristas = data
      this.tallerista.setValue(data[0])
    });
  }

  listarTalleres() {
    this._talleresService.listar().subscribe(data => { this.talleres = data });
  }

  buscarTaller() {
    let taller: Talleres = this.taller.value;
    let tallerista: Persona = this.tallerista.value;
    let dia = moment(this.fechaRegistro.value).format('YYYY-MM-DD' + " 00:00:00");

    let buscarTallerCabDTO = new BuscarTallerCabDTO();
    buscarTallerCabDTO.idTaller = taller.idTaller;
    buscarTallerCabDTO.idTallerista = tallerista.idPersona;
    buscarTallerCabDTO.dia = dia;

    this._tallerHorariosDetService.buscarPorTallerTalleristaFecha(buscarTallerCabDTO).subscribe(data => {

      if (data.length != 0) {
        let idTallerHorarioCab = data[0].tallerHorarioCab.idTallerHorarioCab

        this._tallerHorariosCabService.listarPorId(idTallerHorarioCab).subscribe(res => {
          this.modalidad.setValue(res.modalidad);
          this.tallerDetHoras = data
        });
      } else {
        this.tallerDetHoras = [];
        this.modalidad.setValue(null);
      }
    });
  }

  listarTipoDocumento() {
    this._parametroService.listarTipoDocumento().subscribe(data => {
      this.tipoDocumento = data;
    });
  }

  buscarAsegurado() {
    let tipoDoc = this.tipoDoc.value
    let numDoc = this.numDoc.value

    this._aseguradoService.findByTipoDocAndNumDoc(tipoDoc.idParametro, numDoc).subscribe(data => {
      this.formAsegurado.reset();
      let nombreApellido = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
      this.asegurado.setValue(nombreApellido);
      this.nombreApellido = nombreApellido;
      this.aseguradoEncontrado = data;
    }, error => {
      if (error.status == 400) {
        this._snackBar.open("Asegurado no encontrada", "❌", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "right"
        });
      }
    });
  }

  agregar() {
    let rawValues = this.formDatosTallerista.getRawValue();

    let tallerDet = new TallerHorariosDet();
    tallerDet = this.horaTaller.value;

    let asegurado = new Asegurado();
    asegurado = this.aseguradoEncontrado;
    asegurado.tipoDocumento = rawValues.modalidad;

    let asistencia = new Asistencia();
    asistencia.asegurado = asegurado;
    asistencia.tallerDet = tallerDet;

    this.asistencias.push(asistencia);

    this.dataSource = new MatTableDataSource(this.asistencias);

    this.formAsegurado.reset();
    this.formTallerDet.reset();
    this.nombreApellido = "";
  }

  eliminar(i: number) {
    this.asistencias = this.asistencias.filter((value, index) => {
      return index !== i;
    });
    this.dataSource = new MatTableDataSource(this.asistencias);
  }

  guardarAsistencia() {
    let dialogRef = this._dialog.open(DialogConfirmacionComponent, {
      data: "¿Esta seguro de registrar la asistencia?"
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {

        let asistenciaRequest = new Asistencia();

        for (let asistencia of this.asistencias) {

          let tallerDet = new TallerHorariosDet();
          tallerDet.idTallerDet = asistencia.tallerDet.idTallerDet

          let asegurado = new Asegurado();
          asegurado.idAsegurado = asistencia.asegurado.idAsegurado

          asistenciaRequest.tallerDet = tallerDet
          asistenciaRequest.asegurado = asegurado

          this._asistenciaService.registrar(asistenciaRequest).subscribe(data => {
          });
        }

      }
    });
  }

  salir() {

  }

  // ------------------------------ get formDatosTallerista ------------------------------
  get tallerista() {
    return this.formDatosTallerista.get("tallerista")!
  }

  get taller() {
    return this.formDatosTallerista.get("taller")!
  }

  get modalidad() {
    return this.formDatosTallerista.get("modalidad")!
  }

  get fechaRegistro() {
    return this.formDatosTallerista.get("fechaRegistro")!
  }

  // ------------------------------ get formTallerDet ------------------------------
  get horaTaller() {
    return this.formTallerDet.get("horaTaller")!
  }

  // ------------------------------ get formAsegurado ------------------------------
  get tipoDoc() {
    return this.formAsegurado.get("tipoDoc")!
  }

  get numDoc() {
    return this.formAsegurado.get("numDoc")!
  }

  get asegurado() {
    return this.formAsegurado.get("asegurado")!
  }

}
