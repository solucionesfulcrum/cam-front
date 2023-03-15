import { DialogConfirmacionComponent } from './../../shared/dialog-confirmacion/dialog-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RelacionesCiramService } from './../../core/_service/relaciones-ciram.service';
import { Usuario } from './../../core/_model/usuario';
import { Parametro } from './../../core/_model/parametro';
import { ParametroService } from './../../core/_service/parametro.service';
import { TallerHorariosDetService } from './../../core/_service/taller-horarios-det.service';
import { TallerHorariosCabService } from './../../core/_service/taller-horarios-cab.service';
import { TallerHorariosDet } from './../../core/_model/taller-horarios-det';
import { RegistroTalleresDTO } from './../../core/_DTO/registro-talleres-dto';
import { PersonaService } from './../../core/_service/persona.service';
import { Persona } from './../../core/_model/persona';
import { TallerHorariosCab } from './../../core/_model/taller-horarios-cab';
import { TalleresService } from './../../core/_service/talleres.service';
import { Talleres } from './../../core/_model/talleres';
import { UnidadOperativaService } from './../../core/_service/unidad-operativa.service';
import { UnidadOperativa } from './../../core/_model/unidad-operativa';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-programacion-talleres',
    templateUrl: './programacion-talleres.component.html',
    styleUrls: ['./programacion-talleres.component.css']
  })
  export class ProgramacionTalleresComponent implements OnInit {
  displayedColumns: string[] = [
    'numero',
    'dia',
    'horario',
    'acciones'
  ];
  tallerEtiqueta: string = "-------------------------"
  nombreApellido: string;

  usuarioCab: Usuario
  personaCab: Persona;

  flatBotonBuscar: boolean = true;
  flatBotonAgregarHorario: boolean = true;
  flatFecha: boolean = false;

  talleres: Talleres[];
  modalidades: Parametro[];
  unidadesOperativas: UnidadOperativa[];
  unidadesOperativasHijas: UnidadOperativa[] = [];
  unidadesOperativasPadres: UnidadOperativa[] = [];
  tipoDocumento: Parametro[];
  registroTalleresDTO: RegistroTalleresDTO[] = [];
  horariosTalleres: RegistroTalleresDTO = new RegistroTalleresDTO();

  personaForm: FormGroup;
  cabeceroForm: FormGroup;
  tallerHorariosCabForm: FormGroup;
  tallerHorariosDetForm: FormGroup;

  dataSource: MatTableDataSource<RegistroTalleresDTO> = new MatTableDataSource<RegistroTalleresDTO>(this.registroTalleresDTO);


  personas = [] as any;

  constructor(
    private _formBuilder: FormBuilder,
    private _unidadOperativaService: UnidadOperativaService,
    private _talleresService: TalleresService,
    private _personaService: PersonaService,
    private _tallerHorariosCabService: TallerHorariosCabService,
    private _tallerHorariosDetService: TallerHorariosDetService,
    private _parametroService: ParametroService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listarUnidadesOperativasPadres();
    this.listarTalleres();
    this.listarModalidades();
    this.listarTipoDocumento();
  }

  initForm() {
    this.cabeceroForm = this._formBuilder.group({
      unidadOperativa: [null, [Validators.required]],
      usuario: [null],
    });

    this.tallerHorariosCabForm = this._formBuilder.group({
      taller: [null, [Validators.required]],
      modalidad: [null, [Validators.required]],
      fecInicio: [new Date(), [Validators.required]],
      fecFin: [new Date(), [Validators.required]],
      ciram: [null, [Validators.required]]
    });

    this.personaForm = this._formBuilder.group({
      tipoDoc: [null, [Validators.required]],
      numDoc: [null, [Validators.required]],
      nombres: [null, [Validators.required]],
    });

    this.tallerHorariosDetForm = this._formBuilder.group({
      horaIni: [null, [Validators.required]],
      horaFin: [null, [Validators.required]],
      dia: [null, [Validators.required]],
    });
    this.personaForm.disable();
    this.tallerHorariosDetForm.disable();
  }

  listarUnidadesOperativasPadres() {
    this._unidadOperativaService.obtenerUnidadesOperativasPadres().subscribe(data => {
      this.unidadesOperativas = data;
      this.unidadOperativa.setValue(data[0]);//Se setea La primera unidad operativa padre
      this.obtenerCiram();
    });
  }

  listarTalleres() {
    this._talleresService.listar().subscribe(data => { this.talleres = data });
  }

  listarModalidades() {
    this._parametroService.listarModalidades().subscribe(data => { this.modalidades = data });
  }

  obtenerCiram() {
    this.unidadesOperativasHijas = [];

    let unidadOperativa = this.unidadOperativa.value
    this._unidadOperativaService.obtenerUnidadesOperativasHijas(unidadOperativa.idUnidadOperativa).subscribe(data => {
      this.unidadesOperativasHijas = data;

      //Si la unidad operativa padre no tiene unidades operativas hijas se deshabilita el selector de "Ciram Asociado:"
      if (data.length == 0) {
        this.ciram.disable();
      } else {
        this.ciram.enable();
        this.ciram.setValue(null);
      }
    });
  }

  compararfechas() {
    //Se pasa las hora al formato en el que se van a guardar para poder compararlas
    let horaIni = moment(this.dia.value).format('YYYY-MM-DD ' + this.horaIni.value + ":00");
    let horaFin = moment(this.dia.value).format('YYYY-MM-DD ' + this.horaFin.value + ":00");

    let fecInicio = moment(this.fecInicio.value).format('YYYY-MM-DD' + " 00:00:00");
    let fecFin = moment(this.fecFin.value).format('YYYY-MM-DD' + " 00:00:00");
    let dia = moment(this.dia.value).format('YYYY-MM-DD' + " 00:00:00");

    //Se comprueba la "Fecha de Inicio:" y la "Fecha de Fin:"
    if (this.fecInicio.value > this.fecFin.value) {
      this.flatFecha = true;
      this._snackBar.open("La fecha de inicio no puede ser mayor que la fecha de fin", "❌", {
        verticalPosition: "top",
        horizontalPosition: "right"
      });
      return
    } else {
      this._snackBar.dismiss();
      this.flatFecha = false;
    }
    //Si el  "this.dia.value == null" es por que no se le ha dado en el boton "AGREGAR" el cual tiene la funcion de iniciar la fecha del dia
    //de esa forma se evita que se muestren los mensajes de abajo ya que seran invalidos para la comparacion
    if (this.dia.value == null) { return }
    //Para evitar comportamientos no deseados se termina la secuencia cuando la hora de inicio o hora de fin del taller son null
    if (this.horaIni.value == null || this.horaFin.value == null) { return }

    //Se comprueba la "Hora Inicio de Talle:" y la "Hora Fin de Talle:"
    if (horaIni >= horaFin) {
      this.flatBotonAgregarHorario = true;
      this._snackBar.open("La hora de inicio del taller debe ser menor que la hora de fin del taller", "❌", {
        verticalPosition: "top",
        horizontalPosition: "right"
      });
    } else {
      this._snackBar.dismiss();
      this.flatBotonAgregarHorario = false;
    }
  }

  agregar() {
    let taller = this.taller.value
    this.tallerEtiqueta = taller.codTaller

    this.personaForm.enable();
    this.flatBotonBuscar = false;
    this.tallerHorariosDetForm.enable();
    this.flatBotonAgregarHorario = false;
    this.dia.setValue(this.fecInicio.value);
  }

  listarTipoDocumento() {
    this._parametroService.listarTipoDocumento().subscribe(data => {
      this.tipoDocumento = data;
    });
  }

  buscar() {
    let tipoDoc = this.tipoDoc.value
    let numDoc = this.numDoc.value

    this._personaService.findByTipoDocAndNumDoc(tipoDoc, numDoc).subscribe(data => {
      this.personaForm.reset();
      let nombreApellido = `${data.nombres} ${data.apePaterno} ${data.apeMaterno}`;
      this.nombres.setValue(nombreApellido);
      this.nombreApellido = nombreApellido;
      this.personaCab = data;
    }, error => {
      if (error.status == 400) {
        this._snackBar.open("Persona no encontrada", "❌", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "right"
        });
      }
    });
  }

  agregarHorario() {
    let horariosTalleres = new RegistroTalleresDTO();
    let tallerHorariosCab = new TallerHorariosCab();
    let tallerHorariosDet = new TallerHorariosDet();

    let talleres = new Talleres();
    talleres = this.taller.value;

    let persona = new Persona();
    persona = this.personaCab

    let unidadOperativa = new UnidadOperativa();
    if (this.unidadesOperativasHijas.length == 0) {
      unidadOperativa = this.unidadOperativa.value;
    } else {
      unidadOperativa = this.ciram.value;
    }

    tallerHorariosCab.taller = talleres;
    tallerHorariosCab.persona = persona;
    tallerHorariosCab.unidadOperativa = unidadOperativa;
    tallerHorariosCab.modalidad = this.modalidad.value;
    tallerHorariosCab.fecInicio = moment(this.fecInicio.value).format('YYYY-MM-DD' + " 00:00:00");
    tallerHorariosCab.fecFin = moment(this.fecFin.value).format('YYYY-MM-DD' + " 00:00:00");

    tallerHorariosDet.horaIni = moment(this.dia.value).format('YYYY-MM-DD ' + this.horaIni.value + ":00");
    tallerHorariosDet.horaFin = moment(this.dia.value).format('YYYY-MM-DD ' + this.horaFin.value + ":00");
    tallerHorariosDet.dia = moment(this.dia.value).format('YYYY-MM-DD' + " 00:00:00");
    tallerHorariosDet.tallerHorarioCab = new TallerHorariosCab();

    horariosTalleres.tallerHorariosCab = tallerHorariosCab;
    horariosTalleres.tallerHorariosDet = tallerHorariosDet;

    this.registroTalleresDTO.push(horariosTalleres);

    this.dataSource = new MatTableDataSource(this.registroTalleresDTO);

    this.nombreApellido = "";
    let dia = this.dia.value
    this.personaForm.reset();
    this.tallerHorariosDetForm.reset();
    this.dia.setValue(dia);
  }

  eliminar(i: number) {
    this.registroTalleresDTO = this.registroTalleresDTO.filter((value, index) => {
      return index !== i;
    });

    this.dataSource = new MatTableDataSource(this.registroTalleresDTO);
  }

  guardarProgramacion() {
    let dialogRef = this._dialog.open(DialogConfirmacionComponent, {
      data: "¿Esta seguro de registrar la Programación de Talleres?"
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {

        for (let dto of this.registroTalleresDTO) {

          this._tallerHorariosCabService.registrar(dto.tallerHorariosCab).subscribe(resCab => {

            dto.tallerHorariosDet.tallerHorarioCab.idTallerHorarioCab = resCab.idTallerHorarioCab

            this._tallerHorariosDetService.registrar(dto.tallerHorariosDet).subscribe(resdet => {
            });
          });
        }

      }
    });

  }
  resetearforms() {
    this.tallerEtiqueta = "-------------------------"
    this.flatBotonBuscar = true;
    this.flatBotonAgregarHorario = true;

    this.personaForm.reset();
    this.tallerHorariosDetForm.reset();

    this.personaForm.disable();
    this.tallerHorariosDetForm.disable();
    this._snackBar.dismiss();
  }

  salir() {

  }

  // ------------------------------ get cabeceroForm ------------------------------
  get unidadOperativa() {
    return this.cabeceroForm.get("unidadOperativa")!
  }

  get usuario() {
    return this.cabeceroForm.get("usuario")!
  }

  // ------------------------------ get tallerHorariosCabForm ------------------------------
  get persona() {
    return this.tallerHorariosCabForm.get("persona")!
  }

  get taller() {
    return this.tallerHorariosCabForm.get("taller")!
  }

  get modalidad() {
    return this.tallerHorariosCabForm.get("modalidad")!
  }

  get fecInicio() {
    return this.tallerHorariosCabForm.get("fecInicio")!
  }

  get fecFin() {
    return this.tallerHorariosCabForm.get("fecFin")!
  }

  get ciram() {
    return this.tallerHorariosCabForm.get("ciram")!
  }

  // ------------------------------ get personaForm ------------------------------
  get tipoDoc() {
    return this.personaForm.get("tipoDoc")!
  }

  get numDoc() {
    return this.personaForm.get("numDoc")!
  }

  get nombres() {
    return this.personaForm.get("nombres")!
  }

  // ------------------------------ get tallerHorariosCabForm ------------------------------
  get horaIni() {
    return this.tallerHorariosDetForm.get("horaIni")!
  }

  get horaFin() {
    return this.tallerHorariosDetForm.get("horaFin")!
  }

  get dia() {
    return this.tallerHorariosDetForm.get("dia")!
  }

}

