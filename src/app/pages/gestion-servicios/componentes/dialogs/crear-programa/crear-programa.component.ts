
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { ProgramaCrearRequestDto } from '@models/cartera-de-servicios/cartera-de-servicios';

@Component({
  selector: 'esp-crear-programa',
  templateUrl: './crear-programa.component.html',
  styleUrls: ['./crear-programa.component.scss']
})
export class CrearProgramaComponent implements OnInit {
  programaForm: FormGroup;
  isLoading = false;

  constructor(
    @Inject(DIALOG_DATA) public data: { message: string },
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService
  ) {
    this.programaForm = this._fb.group({
      nombrePrograma: ['', [Validators.required, Validators.maxLength(50)]],
      fechaCreacion: [new Date().toISOString().split('T')[0], [Validators.required]],
      activo: [1, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onClose(): void {
    this._dialogRef.close({ success: false });
  }

  crearPrograma(): void {
    if (this.programaForm.valid) {
      this.isLoading = true;
  
      // Obtener idUsuario desde localStorage
      const usuarioRegId = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario;
  
      // Obtener valores del formulario
      const formValues = this.programaForm.getRawValue();
  
      // Construir el payload
      const payload: ProgramaCrearRequestDto = {
        nombre: formValues.nombrePrograma, // Nombre del programa
        usuarioRegId // ID del usuario que registra
      };
  
      // Llamada al servicio para registrar el programa
      this._programaService.registrarPrograma(payload).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.code === 0) {
            this._dialogRef.close({ success: true, data: response.data });
          } else {
            console.error('Error al crear el programa:', response.message);
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al crear el programa:', error);
        }
      );
    } else {
      this.programaForm.markAllAsTouched();
    }
  }
  
}
