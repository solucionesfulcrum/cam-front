import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';

@Component({
  selector: 'app-show-afiliado',
  templateUrl: './show-afiliado.component.html',
  styleUrls: ['./show-afiliado.component.css']
})
export class ShowAfiliadoComponent implements OnInit {

  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Actualizar Datos', esImagen: true, rutaIcono: 'assets/svg/icon-edit-data.svg'},
    {texto: 'Evaluar Afiliado', colorBtn:'bordeado', loading: false},
  ];

  faSpinner = faSpinner;
  dataAfiliado: any;
  edadPersona: number = 0;
  dataFicha: any = [''];

  tipoDoc: string = '';
  numDoc: string = '';

  links=[
    {url:`/app/contactos/show/${this.tipoDoc}/${this.numDoc}`, title:'Operaciones'},
    {url:`/app/contactos/show/${this.tipoDoc}/${this.numDoc}/evaluaciones`, title:'Evaluaciones'}
  ]

  constructor(private router                        : Router,
              private activeRoute                   : ActivatedRoute,
              private afiliadoServices              : AfiliacionesSolicitudesService) { 
      this.tipoDoc = this.activeRoute.snapshot.paramMap.get('tipoDoc')!;
      this.numDoc = this.activeRoute.snapshot.paramMap.get('numDoc')!;
      this.links[0].url = `/app/contactos/show/${this.tipoDoc}/${this.numDoc}`;
      this.links[1].url = `/app/contactos/show/${this.tipoDoc}/${this.numDoc}/evaluaciones`;
  }

  ngOnInit(): void {

    this.afiliadoServices.getDataAfiliado(this.tipoDoc, this.numDoc).subscribe((data) => {
  
      this.dataAfiliado = data;
      var dateParts = data.fecNac.split("/");
      var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
      var timeDiff = Math.abs(Date.now() - dateObject.getTime());
      this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    })

  }

  EvalAfiliado(){
    
    this.router.navigate(['/app/afiliados/agregaEval'])

    // const dialogRef = this.dialog.open(NewEvalAfiliadoComponent,{
    //   minWidth:'800px',
    //   maxWidth:'50%',
    //   data:{}
    // })
    // dialogRef.closed.subscribe(out =>{
    //   // console.log(out)
    // })
  }

  Notas(){
    // const dialogRef = this.dialog.open(NotasAfilComponent,{
    //   minWidth:'800px',
    //   maxWidth:'50%',        
    //   data:{}
    // })
    // dialogRef.closed.subscribe(out =>{
    //   // console.log(out)
    // })
  }

}
