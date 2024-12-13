import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RegistrarServicioRequestDto } from '@models/cartera-de-servicios/cartera-de-servicios';
import { NotificationService } from '@services/notification.service';
import { TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { CarteraDeServiciosService } from 'src/app/data/services/servicios/cartera-de-servicios.service';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';

@Component({
  selector: 'esp-crear-servicio',
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.scss']
})
export class CrearServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isLoading = false;
  opcionesEvento: TablaOpciones[] = [];

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService,
    private datosGeneralesService: DatosGeneralesService,
    private notificationService               : NotificationService,
    private carteraDeServicios: CarteraDeServiciosService
  ) {
    this.servicioForm = this._fb.group({
      subprograma: ['', [Validators.required]],
      tipoServicio: ['', [Validators.required]],
      nombreServicio: ['', [Validators.required, Validators.maxLength(50)]],
      activo: [1, [Validators.required]]
    });
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
  }

  onClose(): void {
    this._dialogRef.close({ success: false });
  }

  crearServicio(): void {
    if (this.servicioForm.valid) {
      this.isLoading = true;
  
      // Obtener valores del formulario
      const formValues = this.servicioForm.getRawValue();
  
      // Construir el payload
      const payload: RegistrarServicioRequestDto = {
        idServicio: 0, // ID inicial para nuevos servicios
        activo: formValues.activo, // Estado del servicio
        nombre: formValues.nombreServicio, // Nombre del servicio
        idUsuario: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario, // ID del usuario que registra (suponiendo que viene en `data`)
        idSubPrograma: formValues.subprograma, // ID del subprograma seleccionado
        paramTipoServicio: formValues.tipoServicio, // Tipo de servicio seleccionado
        activoAsisRap: undefined // Campo opcional, dejar como undefined si no aplica
      };
  
      // Llamada al servicio para registrar el servicio
      this.carteraDeServicios.registrarServicio(payload).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.code === 0) {
            this.notificationService.success('Servicio creado con éxito.');
            this._dialogRef.close({ success: true, data: response.data });
          } else {
            this.notificationService.warning(response.message);
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al crear el servicio:', error);
          this.notificationService.error('Hubo un problema al crear el servicio.');
        }
      );
    } else {
      this.servicioForm.markAllAsTouched();
    }
  }
}
