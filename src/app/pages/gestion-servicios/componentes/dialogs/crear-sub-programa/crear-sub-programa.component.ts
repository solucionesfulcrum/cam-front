
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';
import { SubProgramaService } from 'src/app/data/services/servicios/subPrograma.service';
import { SubProgramaCrearRequestDto } from '@models/cartera-de-servicios/cartera-de-servicios';

@Component({
  selector: 'esp-crear-sub-programa',
  templateUrl: './crear-sub-programa.component.html',
  styleUrls: ['./crear-sub-programa.component.scss']
})
export class CrearSubProgramaComponent implements OnInit {
  subprogramaForm: FormGroup;
  isLoading = false;
  opcionesProgramas: any[] = [];

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<any>,
    private _fb: FormBuilder,
    private _programaService: ProgramaService,
    private _subProgramaService: SubProgramaService
  ) {
    this.subprogramaForm = this._fb.group({
      programa: ['', [Validators.required]],
      nombreSubprograma: ['', [Validators.required, Validators.maxLength(50)]],
      activo: [1, [Validators.required]]
    });
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

  crearSubprograma(): void {
    if (this.subprogramaForm.valid) {
      this.isLoading = true;
  
      // Obtener valores del formulario
      const formValues = this.subprogramaForm.getRawValue();
  
      // Construir el payload
      const payload: SubProgramaCrearRequestDto = {
        nombre: formValues.nombreSubprograma, // Nombre del subprograma
        usuarioRegId: (JSON.parse(localStorage.getItem('camUser')!)).idUsuario, // ID del usuario que registra (suponiendo que viene en `data`)
        idPrograma: formValues.programa // ID del programa seleccionado
      };
  
      // Llamada al servicio para registrar el subprograma
      this._subProgramaService.registrarSubprograma(payload).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.code === 0) {
            this._dialogRef.close({ success: true, data: response.data });
          } else {
            console.error('Error al crear el subprograma:', response.message);
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error al crear el subprograma:', error);
        }
      );
    } else {
      this.subprogramaForm.markAllAsTouched();
    }
  }
  
}
