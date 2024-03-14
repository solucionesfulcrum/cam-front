import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { FormatoColumna, TablaOpciones } from '@shared/components/tabla-adaptable/formato-columna.model';

@Component({
  selector: 'esp-contratos-asignar-servicios',
  templateUrl: './contratos-asignar-servicios.component.html',
  styleUrls: ['./contratos-asignar-servicios.component.scss']
})
export class ContratosAsignarServiciosComponent {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Cancelar'},
    {texto: 'Guardar', colorBtn:'mezclado'},
    {texto: 'Guardar y Enviar', colorBtn:'mezclado'},
  ];

  opcionesEvento: TablaOpciones[] = [
    {idOpcion: 1, nombre: 'Taller', value: 1},
    {idOpcion: 2, nombre: 'Festividad', value: 2},
    {idOpcion: 3, nombre: 'Curso', value: 3},
  ];
  opcionesModalidad: TablaOpciones[] = [
    {idOpcion: 1, nombre: 'Presencial', value: 1},
    {idOpcion: 2, nombre: 'Virtual', value: 2},
    {idOpcion: 3, nombre: 'Híbrido', value: 3},
  ];
  
  dataColumnas: FormatoColumna[] = [
    {nomAttribute: 'idServicio', oculto: true},
    {header: 'Servicio', tipo: 'inputText', nomAttribute: 'nomServicio', resaltado: true},
    {header: 'Tipo de Evento', tipo: 'select', opciones: this.opcionesEvento, nomAttribute: 'typeEvent'},
    {header: 'Fecha de inicio', tipo: 'inputFecha', nomAttribute: 'fecInicio'},
    {header: 'Fecha de Fin', tipo: 'inputFecha', nomAttribute: 'fecFin'},
    {header: 'Modalidad', tipo: 'select', opciones: this.opcionesModalidad, nomAttribute: 'typeModalidad'}
  ];

  dataServiciosEnviado = new FormControl();
  
  ctrlDataObtenida = new FormControl();

  ngOnInit(){
    this.ctrlDataObtenida.valueChanges.subscribe((data)=>{
      console.log(data);
    })
  }

  aniadirFila(){
    this.dataServiciosEnviado.setValue({idServicio: 1})
  }

}
