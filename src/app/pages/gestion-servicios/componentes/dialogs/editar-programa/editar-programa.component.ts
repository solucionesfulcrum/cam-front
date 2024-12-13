import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { ProgramaEditarRequestDto, ProgramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';

@Component({
  selector: 'esp-editar-programa',
  templateUrl: './editar-programa.component.html',
  styleUrls: ['./editar-programa.component.scss'],
})
export class EditarProgramaComponent implements OnInit {
  programaForm: FormGroup;
  isLoading = false;
  

  constructor(
    @Inject(DIALOG_DATA) public data: { message: string; programa: ProgramaListadoItem },
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService
  ) {
    this.programaForm = this._fb.group({
      idPrograma: [{ value: data.programa.idPrograma, disabled: true }],
      nombrePrograma: [data.programa.nombrePrograma, [Validators.required, Validators.maxLength(400)]],
      fechaModificacion: [{ value: data.programa.fechaModificacion, disabled: true }],
      fechaCreacion: [{ value: data.programa.fechaCreacion, disabled: true }],
      activo: [data.programa.activo, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onClose(): void {
    this._dialogRef.close({ success: false });
  }

  updatePrograma(): void {
    if (this.programaForm.valid) {
      this.isLoading = true;
  
      // Obtener idUsuario desde localStorage
      const usuarioModId = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
  
      // Obtener valores del formulario
      const formValues = this.programaForm.getRawValue();
  
      // Construir el payload
      const payload: ProgramaEditarRequestDto = {
        nombre: formValues.nombrePrograma, // Nombre del programa
        activo: formValues.activo, // Estado activo/inactivo
        usuarioModId // ID del usuario que modifica
      };
  
      // Llamada al servicio para actualizar el programa
      this._programaService.editarPrograma(this.data.programa.idPrograma, payload).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.code === 0) {
            this._dialogRef.close({ success: true, data: response.data });
          } else {
            console.error('Error al actualizar el programa:', response.message);
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error al actualizar el programa:', error);
        }
      );
    } else {
      this.programaForm.markAllAsTouched();
    }
  }
  
}
