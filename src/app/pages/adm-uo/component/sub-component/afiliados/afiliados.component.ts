import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Afiliados } from '@models/adm-uo/adm-uo';
import { AfiliadoService } from 'src/app/data/services/afiliaciones/afiliado.service';

@Component({
  selector: 'esp-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.scss']
})
export class AfiliadosComponent {
  loading = true;

  columns : string[] = [
    'numero',
    'nombreUsuario', 
    'fechaInicio', 
    'fechaFin', 
    'rol', 
    'estado',
  ]

  dataSource: MatTableDataSource<Afiliados> = new MatTableDataSource<Afiliados>();
faSpinner: IconProp = faSpinner;
  constructor(
    private afiliadoService : AfiliadoService
  ) {
   
  }

  ngOnInit(): void {
    this.afiliadoService.getAfiliadosEditCiram("1").subscribe(data => {
      this.loading = false;
      this.dataSource.data = data.data
    })
  }


}
