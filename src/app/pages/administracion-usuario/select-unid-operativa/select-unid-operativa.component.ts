import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { NotificationService } from '@services/notification.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'esp-select-unid-operativa',
  templateUrl: './select-unid-operativa.component.html',
  styleUrls: ['./select-unid-operativa.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule]
})
export class SelectUnidOperativaComponent {

  faSpinner = faSpinner;
  userInfo = Object();
  listUnidOperativa: any;

  constructor(private router                          : Router,
              private datosGeneralesService           : DatosGeneralesService,
              private notificationService             : NotificationService) { }

  ngOnInit(){
    if(localStorage.getItem('camUser') != 'null'){
      this.userInfo = JSON.parse(localStorage.getItem('camUser')!);
      this.datosGeneralesService.getUnidadesOperativasAsignadas(this.userInfo.idUsuario).subscribe((data)=>{
        if (data.code == 0) {
          this.listUnidOperativa = data.data;
        }
        else{
          this.notificationService.warning(data.message);
        }
      })
    }

  }

  AsignarUnidadOperativa(unidOperativ: any){
    console.log(unidOperativ)
    localStorage.setItem('UnidElegida', JSON.stringify(unidOperativ));
    this.router.navigate(['/app']);
  }
}
