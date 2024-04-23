import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'esp-adm-ciram',
  templateUrl: './adm-ciram.component.html',
  styleUrls: ['./adm-ciram.component.scss']
})
export class AdmCiramComponent {

  constructor(
    private authService: AuthService,
    private router:Router
  ) { }

  unid = JSON.parse(localStorage.getItem('UnidElegida')!);
  listCiramActivos: any;
  listCiramInactivos: any;

  getDataFecha(value: any) {
    /*this.formBuscar.get('frmSearchDate')?.setValue(value);
    console.log("fecha?",value)
    this.onLoadData();*/
  }
  ngOnInit() {
    this.authService.listarActivosInactivos({idUnidadOperativa:parseInt(this.unid.idUnidOperativa),fecFin:"2024-04-31",fecInicio:"2024-01-01",texto:""}).subscribe((data) => {
      this.listCiramActivos = data.data.ciramActivos
      this.listCiramInactivos = data.data.ciramInactivos
    })
  }

  nuevoCiram(){
    this.router.navigate(['/app/adm-uo/registro']);
  }
}
