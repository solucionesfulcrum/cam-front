import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationService } from '@services/notification.service';
import { debounceTime, forkJoin } from 'rxjs';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DialogConfirmacionComponent } from './dialog-confirmacion/dialog-confirmacion.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'esp-uo-asistencia-rapida',
  templateUrl: './uo-asistencia-rapida.component.html',
  styleUrls: ['./uo-asistencia-rapida.component.scss']
})
export class UoAsistenciaRapidaComponent {
  dataListCams!: any;
  ctrlSearchRed = new FormControl('');
  ctrlSearchCAM = new FormControl('');
  ctrlActivarList = new FormControl(false);
  edicionActiva: boolean = false;
  filteredList: any[] = [];
  listCams: any[] = [];
  redElegida: any;

  constructor(private notificationService     : NotificationService,
              private controlService          : ControlProgramacionService,
              private dialog                  : Dialog,
              private datosService            : DatosGeneralesService) { }

  ngOnInit(): void {
    this.setListeners();
    this.getListRedes().then(()=> {this.selectRed(this.filteredList[0])});
  }

  setListeners(){
    this.ctrlSearchRed.valueChanges.pipe(debounceTime(1000)).subscribe((data)=>{
      this.getListRedes();
    })
    this.ctrlSearchCAM.valueChanges.pipe(debounceTime(1000)).subscribe((data)=>{
      this.searchCam();
    })
    this.ctrlActivarList.valueChanges.subscribe((data)=>{
      this.listCams.forEach((element)=>{
        element.formCheck.setValue(data);
      })
    })
  }

  selectRed(obj: any){
    this.redElegida = obj;
    this.ctrlActivarList.setValue(false, {emitEvent: false});
    this.ableCheckBoxs(false);
    this.ctrlSearchCAM.setValue('', {emitEvent: false});
    this.searchCam();
  }

  async searchCam(){
    this.datosService.getUnidadesOperativasRed(this.ctrlSearchCAM.value!, this.redElegida.codigo).subscribe((data)=>{
      if (data.code == 0) {
        this.controlService.getCamsHabilitadosAsistenciaRapida(this.redElegida.codigo).then((listActivados)=> {
          if (listActivados.code == 0) {
            data.data.forEach((element: any) => {
              element.formCheck = new FormControl(listActivados.data.some((validate: any) => validate.idUnidadOperativa == element.idUnidadOperativa ) ? true : false);
              element.formCheck.valueChanges.subscribe((value: boolean)=>{
                this.ctrlActivarList.setValue(this.listCams.every((x)=> x.formCheck.value == true), {emitEvent: false});
              });
            });
            this.listCams = data.data;
            this.ableCheckBoxs(false);
          }
          else{
            this.notificationService.warning(listActivados.message);
          }
        })
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  ableCheckBoxs(valid: boolean, resetear?: boolean){
    if (valid) {
      this.ctrlActivarList.enable({emitEvent: false});
      this.listCams.forEach((x)=> x.formCheck.enable({emitEvent: false}));
    }
    else{
      this.ctrlActivarList.disable({emitEvent: false});
      this.listCams.forEach((x)=> x.formCheck.disable());
      if (resetear) {
        this.searchCam();
      }
    }
    this.edicionActiva = valid;
  }

  async getListRedes(){
    await this.datosService.getReds(this.ctrlSearchRed.value!).then((data)=>{
      if (data.code == 0) {
        this.filteredList = data.data;
        this.dataListCams = true;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  confirmActivate(){
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {
        titulo: 'Confirmar Cambios',
        subText: 'Si confirma, se guardará la selección realizada',
        type: 1
      }
    });
    // Resetea la bandera cuando la alerta se cierra
    dialogRef.closed.subscribe((data) => {
      if (data) {
        forkJoin(this.controlService.getCamsHabilitadosAsistenciaRapidaActivar(this.listCams.filter((element)=> element.formCheck.value == true).map((x)=> x.idUnidadOperativa)),this.controlService.getCamsHabilitadosAsistenciaRapidaDesactivar(this.listCams.filter((element)=> element.formCheck.value == false).map((x)=> x.idUnidadOperativa))).subscribe(([firstGet, secondGet])=>{
          if (firstGet.code == 0 && secondGet.code == 0) {
            this.ableCheckBoxs(false);
            this.notificationService.success('Se guardaron las habilitaciones registradas');
          }
          else{
            this.notificationService.warning(firstGet.code != 0 ? firstGet.message : secondGet.message);
          }
        })
      }
    });
  }
}
