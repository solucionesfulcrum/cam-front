import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-select-unid-operativa',
  templateUrl: './select-unid-operativa.component.html',
  styleUrls: ['./select-unid-operativa.component.css']
})
export class SelectUnidOperativaComponent implements OnInit {

  constructor(
    private router: Router,
  ) {

  }

  ngOnInit(): void {
  }

  AsignarUnidadOperativa(): void {
    console.log("asignar unidad operativa")
    localStorage.setItem('unidadOperativaId', '1');
    //this.router.navigate(['/registro']);
  }
}
