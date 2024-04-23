import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { Parametro } from '@models/parametros-busqueda.model';
import { data } from 'autoprefixer';

@Component({
  selector: 'esp-edit-active-user',
  templateUrl: './edit-active-user.component.html',
  styleUrls: ['./edit-active-user.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})

export class EditActiveUserComponent {
  opciones: Parametro[] = [];
  nombreCompleto= '';
  public formDatosPersonales = this.fb.nonNullable.group({
    //frmSelectDoc: new FormControl(''),
    //frmNombres: ['', [Validators.required, Validators.minLength(8)]]
    frmNombres: ['', [Validators.required]]
  });
  constructor(private fb: FormBuilder, private datosService: DatosGeneralesService) {

  }

  grabarDatosPersonales(){
    
  }
  ngOnInit() {
    this.datosService.getTipoParametros('GENERO').subscribe((data) => {
      console.log(data);
      this.opciones = data.data;
      /*if (this.data.type == 2) {
        this.formNewContrato.controls.frmSelectDoc.setValue('1');
        this.formNewContrato.controls.frmDoc.setValue(this.data.dataTallerista.nroDoc);
        this.searchDataPersona(1)
      }*/
    });
    this.nombreCompleto = (JSON.parse(localStorage.getItem('camUser')!)).nombres
    const idUsuarioTemp = (JSON.parse(localStorage.getItem('camUser')!)).idUsuario
    this.formDatosPersonales.controls.frmNombres.setValue(this.nombreCompleto)
    this.datosService.getObtenerDatos(idUsuarioTemp).subscribe((data) => {
      console.log(data.data.datosPersonales)
      //this.formDatosPersonales.controls.frmNombres.setValue
    })
  }
} 
