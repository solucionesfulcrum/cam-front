import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DatosGeneralesService } from '@services/datos-generales.service';
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
    console.log(this.listUnidOperativa)
    if(localStorage.getItem('sigpsUser') != 'null'){
      this.userInfo = JSON.parse(localStorage.getItem('sigpsUser')!);
      console.log(this.userInfo)
      this.datosGeneralesService.getUnidadesOperativasAsignadas(this.userInfo.idUsuario).subscribe((data)=>{
        if (data.code == 0) {
          this.listUnidOperativa = data.data;
          console.log(data)
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
