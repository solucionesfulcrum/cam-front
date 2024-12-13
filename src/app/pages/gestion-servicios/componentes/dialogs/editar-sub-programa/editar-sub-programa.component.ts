import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SubProgramaEditarRequestDto, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { SubProgramaService } from 'src/app/data/services/servicios/sub-programa.service';

// EditarSubProgramaComponent
@Component({
  selector: 'esp-editar-sub-programa',
  templateUrl: './editar-sub-programa.component.html',
  styleUrls: ['./editar-sub-programa.component.scss']
})
export class EditarSubProgramaComponent implements OnInit {
  subprogramaForm: FormGroup;
  isLoading = false;
  opcionesProgramas: any[] = [];

  constructor(
    @Inject(DIALOG_DATA) public data: {message: string, subPrograma: SubprogramaListadoItem},
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService,
    private _subProgramaService: SubProgramaService,
  ) {
    this.subprogramaForm = this._fb.group({
      programa: [data.subPrograma.idPrograma, [Validators.required]],
      nombreSubprograma: [data.subPrograma.nombreSubPrograma, [Validators.required, Validators.maxLength(400)]],
      activo: [data.subPrograma.activo, [Validators.required]],
      fechaModificacion: [{ value: this.formatDate(data.subPrograma.fechaModificacion), disabled: true }],
      fechaCreacion: [{ value: this.formatDate(data.subPrograma.fechaCreacion), disabled: true }],
      idSubPrograma: [{ value: data.subPrograma.idSubPrograma, disabled: true }],
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
    this._programaService.listarActivos().subscribe((data)=>{
      if(data.code == 0) {
        this.opcionesProgramas = data.data
      }
      else{

      }  
    })
  }

  onClose(): void {
    this._dialogRef.close({ success: false });
  }

  editarSubprograma(): void {
    if (this.subprogramaForm.valid) {
      this.isLoading = true;
  
      // Obtener valores del formulario
      const formValues = this.subprogramaForm.getRawValue();
  
      // Construir el payload
      const payload: SubProgramaEditarRequestDto = {
        nombre: formValues.nombreSubprograma,
        idPrograma: formValues.programa,
        activo: formValues.activo,
        usuarioModId:  (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
      };
  
      // Llamada al servicio para editar el subprograma
      this._subProgramaService.editarSubPrograma(this.data.subPrograma.idSubPrograma, payload).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.code === 0) {
            this._dialogRef.close({ success: true, data: response.data });
          } else {
            console.error('Error al editar el subprograma:', response.message);
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Error al editar el subprograma:', error);
        }
      );
    } else {
      this.subprogramaForm.markAllAsTouched();
    }
  }
  
}
