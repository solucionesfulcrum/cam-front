import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { ProgramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';

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
      nombrePrograma: [data.programa.nombrePrograma, [Validators.required, Validators.maxLength(50)]],
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
      const updatedPrograma = {
        ...this.data.programa,
        ...this.programaForm.getRawValue(),
      };

     /* this._programaService.updatePrograma(updatedPrograma).subscribe(
        (response) => {
          this.isLoading = false;
          this._dialogRef.close({ success: true, data: response });
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al actualizar el programa', error);
        }
      );*/
    } else {
      this.programaForm.markAllAsTouched();
    }
  }
}
