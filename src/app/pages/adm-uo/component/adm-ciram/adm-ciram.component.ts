import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AppRoute } from 'src/app/data/constants/app-route.constant';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'esp-adm-ciram',
  templateUrl: './adm-ciram.component.html',
  styleUrls: ['./adm-ciram.component.scss']
})
export class AdmCiramComponent {

  constructor(
    private authService: AuthService,
    private router:Router,
    private fb: FormBuilder, 
  ) { }

  unid = JSON.parse(localStorage.getItem('UnidElegida')!);
  listCiramActivos: any;
  listCiramInactivos: any;

  formBuscar: FormGroup = this.fb.group({
    frmSearch:new FormControl(""),
    //frmSearchDate:new FormControl(""),
    //frmSearchEstado:new FormControl(24),
  });

  getDataFecha(value: any) {
    //this.formBuscar.get('frmSearchDate')?.setValue(value);
    ////console.log("fecha?",value)
    //this.onLoadData();

  }
  ngOnInit() {
    ////console.log(this.formBuscar.get('frmSearch'))
    const fechaInicio = "2024-01-01"
    const fechaFin = "2024-12-01"
    this.authService.listarActivosInactivos({idUnidadOperativa:parseInt(this.unid.idUnidOperativa),fecFin:fechaFin,fecInicio:fechaInicio,texto:""}).subscribe((data) => {
      this.listCiramActivos = data.data.ciramActivos
      this.listCiramInactivos = data.data.ciramInactivos
    })
  }
  showUoCiram(idUnidadOperativa:any){
    this.router.navigate([`app/adm-uo/show/${idUnidadOperativa}`])
  }
  editUoCiram(idUnidadOperativa:any){
    this.router.navigate([`app/adm-uo/edit/${idUnidadOperativa}`])
  }
  nuevoCiram(){
    this.router.navigate(['/app/adm-uo/registro']);
  }
}
