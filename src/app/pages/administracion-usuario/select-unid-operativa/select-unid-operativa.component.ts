import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdmServiceService } from '../services/adm-service.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-unid-operativa',
  templateUrl: './select-unid-operativa.component.html',
  styleUrls: ['./select-unid-operativa.component.css']
})
export class SelectUnidOperativaComponent implements OnInit {
  unidadesOperativas = Object();
  constructor(
    private router: Router,
    private serv: AdmServiceService,
  ) {

  }


  ngOnInit(): void {
    const idUser = JSON.parse(localStorage.getItem("dataLog")!)
    this.serv.getUnidadesOperativas(idUser.idUserApp).subscribe({
      next: (resp: any) => {
        this.unidadesOperativas = resp.data[0]
        console.log("cresultado de uo .... ", this.unidadesOperativas);
      },
      error: (resp) => {
        console.log("error resultado de uo .... ", resp);
      },
    });
  }

  AsignarUnidadOperativa(data:any): void {
    console.log("asignar unidad operativa",data)
    localStorage.setItem('unidadOperativaId', data);
    this.router.navigate(['/app']);
  }
}
