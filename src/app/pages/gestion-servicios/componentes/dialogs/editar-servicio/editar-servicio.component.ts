import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EditarServicioRequestDto, ServicioListadoItem, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { NotificationService } from '@services/notification.service';
import { TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { CarteraDeServiciosService } from 'src/app/data/services/servicios/cartera-de-servicios.service';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { SubProgramaService } from 'src/app/data/services/servicios/sub-programa.service';

@Component({
  selector: 'esp-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.scss']
})
export class EditarServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isLoading = false;
  opcionesEvento: TablaOpciones[] = [];
  opcionesSubProgramas: any[] = [];

  constructor(
    @Inject(DIALOG_DATA) public data: { message: string, servicio: ServicioListadoItem},
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService,
    private datosGeneralesService: DatosGeneralesService,
    private notificationService               : NotificationService,
    private subProgramaService: SubProgramaService,
    private carteraDeServicios: CarteraDeServiciosService
  ) {
    this.servicioForm = this._fb.group({
      subprograma: [data.servicio.idSubPrograma, [Validators.required]],
      tipoServicio: [data.servicio.paramTipoServicio, [Validators.required]],
      nombreServicio: [data.servicio.nombreServicio, [Validators.required, Validators.maxLength(200)]],
      idServicio: [data.servicio.idServicio, {disabled: true}],
      fechaModificacion: [{ value: this.formatDate(data.servicio.fechaModificacion), disabled: true }],
      fechaCreacion: [{ value: this.formatDate(data.servicio.fechaCreacion), disabled: true }],
      activo: [data.servicio.activo, [Validators.required]]
    });
  }

  formatDate(fecha: string | null | undefined): string {
    if (!fecha) {
      return ''; // Retorna una cadena vacía si la fecha no es válida
    }
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return ''; // Maneja fechas inválidas
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    this.datosGeneralesService.getTipoParametros('TIPO_SERVICIO').subscribe((data)=>{
      if (data.code == 0) {
        data.data.forEach((x)=>{
          this.opcionesEvento.push({idOpcion: x.idParametros, nombre: x.nombre, value: x.idParametros})
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })

    this.subProgramaService.listarActivos().subscribe((data)=>{
      if(data.code == 0) {
        this.opcionesSubProgramas = data.data
      }
      else{

      }  
    })
  }

  onClose(): void {
    this._dialogRef.close({ success: false });
  }

  editarServicio(): void {
    if (this.servicioForm.valid) {
      this.isLoading = true;
      const formValues = this.servicioForm.getRawValue();
      const payload: EditarServicioRequestDto = {
        idServicio: this.data.servicio.idServicio, // ID del servicio (obtenido desde los datos iniciales)
        nombre: formValues.nombreServicio, // Nombre del servicio
        idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario, // ID del usuario que está editando (asume que viene de `data`)
        idSubPrograma: formValues.subprograma, // ID del subprograma seleccionado
        paramTipoServicio: formValues.tipoServicio, // Tipo de servicio seleccionado
      };

      this.carteraDeServicios.editarServicio(payload).subscribe(
        (response: any) => {
          this.isLoading = false;
          this._dialogRef.close({ success: true, data: response });
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error al editar el servicio', error);
        }
      ); 
    } else {
      this.servicioForm.markAllAsTouched();
    }
  }
}
