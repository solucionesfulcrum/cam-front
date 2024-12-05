import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ProgramaListadoItem, SubprogramaListadoItem } from '@models/cartera-de-servicios/cartera-de-servicios';
import { Parametro } from '@models/parametros-busqueda.model';
import { NotificationService } from '@services/notification.service';
import { ProgramaService } from 'src/app/data/services/servicios/programa.service';

@Component({
  selector: 'esp-lista-programas',
  templateUrl: './lista-programas.component.html',
  styleUrls: ['./lista-programas.component.scss']
})
export class ListaProgramasComponent {
  formBuscar: FormGroup = this.fb.group({
    frmSearch: new FormControl(''),
    frmSearchDate: new FormControl(''),
    frmSearchEstado: new FormControl(),
    frmSearchCam: new FormControl(''),
    frmSearchRed: new FormControl('')
  });

  faSpinner = faSpinner;
  dataSource: ProgramaListadoItem[] = [];
  pageIndex = 0;
  pageNum = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  total = 0;
  loadingData = false;

  opciones: Parametro[] = [];
  opciones_cam: Parametro[] = [];
  opciones_red: Parametro[] = [];
  seleccionados: number[] = [];

  columns: string[] = [
    'idPrograma',
    'nombrePrograma',
    'fechaCreacion',
    'fechaModificacion',
    'activo',
  ];


  constructor(
    private fb: FormBuilder,
    private programaService: ProgramaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    /*this.datosService.getTipoParametros('ESTADO_FICHA_ADMISION').subscribe((data) => {
      this.opciones = data.data;
    });*/

    /*this.datosService.getAllCams().subscribe((data) => {
      this.opciones_cam = data.data
        .map((e: any) => {
          return { ...e, valor1: e.codigo } as Parametro;
        })
        .sort((a: any, b: any) => (a.nombre < b.nombre ? -1 : a.nombre > b.nombre ? 1 : 0));
      this.onLoadData();
    });

    this.datosService.getReds().subscribe((data) => {
      this.opciones_red = data.data.map((e: any) => {
        return { ...e, valor1: e.codigo } as Parametro;
      });
    });*/

    this.onLoadData();
  }

  onLoadData(): void {
    setTimeout(() => {

      this.loadingData = true;
  
      this.programaService.listarProgramas(this.getPayload()).subscribe({
        next: (response) => {
          this.dataSource = response.data.list;
          this.pageNum = response.data.pageNum;
          this.pageSize = response.data.pageSize;
          this.total = response.data.total;
          this.loadingData = false;
        },
        error: () => {
          this.notificationService.error('Error al cargar los servicios.');
          this.loadingData = false;
        }
      });
    })
   
  }
  
  getPayload(){

    var fecInicio: any;
    var fecFin: any;

    if (this.formBuscar.value.frmSearchDate == '') {
      //fecInicio = `${new Date().getFullYear()}-1-1`;
      fecInicio = `2020-1-1`;
      fecFin = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
    }
    else{
      var fechaSinFormatInit = this.formBuscar.value.frmSearchDate.split(' - ')[0];
      var fechaSinFormatFin = this.formBuscar.value.frmSearchDate.split(' - ')[1];
      fecInicio = `${fechaSinFormatInit.split('/')[2]}-${fechaSinFormatInit.split('/')[1]}-${fechaSinFormatInit.split('/')[0]}`;
      fecFin = `${fechaSinFormatFin.split('/')[2]}-${fechaSinFormatFin.split('/')[1]}-${fechaSinFormatFin.split('/')[0]}`;
    }

    return {
      texto: this.formBuscar.get('frmSearch')?.value || '',
      fecInicio,
      fecFin,
      pageNum: this.pageNum.toString(),
      pageSize: this.pageSize.toString()
    };
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.pageNum = event.pageIndex + 1;
    this.onLoadData();
  }

  getDataFecha(value: any){
    this.formBuscar.get('frmSearchDate')?.setValue(value);
    this.onLoadData();
  }


  firstDisplayValue(value: any): void {
    this.formBuscar.get('frmSearchEstado')?.setValue(value);
    this.onLoadData();
  }

  secDisplayValue(value: any): void {
    this.formBuscar.get('frmSearchCam')?.setValue(value === 'null' ? '' : value);
    this.onLoadData();
  }

  thirdDisplayValue(value: any): void {
    /*const valueRed = value === 'null' ? '' : value;
    this.formBuscar.get('frmSearchRed')?.setValue(valueRed);
    if (valueRed !== '') {
      this.datosService.getCams(valueRed).subscribe((data) => {
        this.opciones_cam = data.data
          .map((e: any) => {
            return { ...e, valor1: e.codigo } as Parametro;
          })
          .sort((a: any, b: any) => (a.nombre < b.nombre ? -1 : a.nombre > b.nombre ? 1 : 0));
        this.onLoadData();
      });
    } else {
      setTimeout(() => {
        this.datosService.getAllCams().subscribe((data) => {
          this.opciones_cam = data.data
            .map((e: any) => {
              return { ...e, valor1: e.codigo } as Parametro;
            })
            .sort((a: any, b: any) => (a.nombre < b.nombre ? -1 : a.nombre > b.nombre ? 1 : 0));
          this.onLoadData();
        });
      });
    }*/
  }

  afectarTodo(evento: Event): void {
    const element = evento.target as HTMLInputElement;
    this.dataSource = this.dataSource.map((data) => ({ ...data, marcar: Boolean(element.checked) }));
    this.seleccionados = element.checked
      ? this.dataSource.map((data) => data.idPrograma)
      : [];
  }

  seleccionarFila(evento: Event): void {
    const element = evento.target as HTMLInputElement;
    if (element.checked) {
      this.seleccionados.push(parseInt(element.value, 10));
    } else {
      this.seleccionados = this.seleccionados.filter((item) => item !== parseInt(element.value, 10));
    }
  }




  onToggleActivo(event: Event, idServicio: number): void {
    const inputElement = event.target as HTMLInputElement; // Aseguramos el tipo
    const isChecked = inputElement.checked; // Obtenemos el estado del toggle
    const newValue = isChecked ? 1 : 0;
  
    // Realizar la llamada al servicio para actualizar el estado
    /*this.carteraDeServiciosService.updateActivo(idServicio, newValue).subscribe({
      next: () => {
        this.notificationService.success('Estado actualizado correctamente.');
        this.onLoadData(); // Refresca la tabla
      },
      error: () => {
        this.notificationService.error('Error al actualizar el estado.');
      }
    });*/
  }
  
  onToggleActivoAsistenciaRap(event: Event, idServicio: number): void {
    const inputElement = event.target as HTMLInputElement; // Aseguramos el tipo
    const isChecked = inputElement.checked; // Obtenemos el estado del toggle
    const newValue = isChecked ? 1 : 0;
    // Realizar la llamada al servicio para actualizar el estado
    /*this.carteraDeServiciosService.updateActivoAsistenciaRap(idServicio, newValue).subscribe({
      next: () => {
        this.notificationService.success('Estado de asistencia rápida actualizado correctamente.');
        this.onLoadData(); // Refresca la tabla
      },
      error: () => {
        this.notificationService.error('Error al actualizar el estado de asistencia rápida.');
      }
    });*/
  }

  ejecutarAccionSeleccionados(): void {
    // Filtrar los elementos seleccionados
    const seleccionados = this.dataSource.filter(item => item.marcar);
  
    if (seleccionados.length === 0) {
      this.notificationService.error('No hay elementos seleccionados.');
      return;
    }
  
    // Realizar la acción deseada sobre los seleccionados
    seleccionados.forEach(item => {
      console.log(`Acción realizada sobre el servicio con ID: ${item.idPrograma}`);
      // Aquí puedes llamar a un servicio, actualizar valores, etc.
      // Ejemplo:
      // this.carteraDeServiciosService.realizarAccion(item.idServicio).subscribe({...});
    });
  
    this.notificationService.success(`${seleccionados.length} elementos procesados correctamente.`);
  }
  
}
