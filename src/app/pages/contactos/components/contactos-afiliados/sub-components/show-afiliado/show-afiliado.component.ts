import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';

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
  edadPersona: number = 0;

  idFicha: string = '';
  dataFichaAfiliado: any = Object();
  direccionActual: any = Object();
  dataShow = false;

  links=[
    {url:`/app/contactos/show/${this.idFicha}`, title:'Operaciones'},
    {url:`/app/contactos/show/${this.idFicha}/evaluaciones`, title:'Evaluaciones'}
  ]

  constructor(private router                        : Router,
              private activeRoute                   : ActivatedRoute,
              private aseguradoServices             : ContactosAfiliadosService,
              private datosGeneralesServices        : DatosGeneralesService,
              private notificationService           : NotificationService,
              private afiliadoServices              : AfiliacionesSolicitudesService) { 
      this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!;
      this.links[0].url = `/app/contactos/show/${this.idFicha}`;
      this.links[1].url = `/app/contactos/show/${this.idFicha}/evaluaciones`;
  }

  ngOnInit(): void {
    this.getData();

    // this.afiliadoServices.getDataAfiliado(this.tipoDoc, this.numDoc).subscribe((data) => {
  
    //   this.dataAfiliado = data;
    //   var dateParts = data.fecNac.split("/");
    //   var dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]); 
    //   var timeDiff = Math.abs(Date.now() - dateObject.getTime());
    //   this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    // })
  }

  getData(){
    this.aseguradoServices.obtenerFichaAsegurado(this.idFicha).subscribe((data)=>{
      if (data.code == 0) {
        this.dataFichaAfiliado = data.data;
        var dateObject = new Date(data.data.asegurado.fecNacimiento); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        data.data.fichaAdmision.direccion.forEach((x: any) => {
          if(x.activo == 1) {
            this.direccionActual = x;
            this.datosGeneralesServices.searchByUbigeo(x.codUbiDep + x.codUbiProv + x.codUbiDist).subscribe((datos)=>{
              if (datos.code == 0) {
                this.direccionActual.localizacion = datos.data.region + ' - ' + datos.data.provincia + ' - ' + datos.data.distrito;
                console.log(this.direccionActual)
              }
              else{
                this.notificationService.warning(datos.message);
              }
            })
          }
        });
        console.log(data.data);

        this.dataShow = true;
      }
      else{
        this.notificationService.warning(data.message);
      }
    })
  }

  editDataAsegurado(){
    this.router.navigate(['/app/contactos/edit-info-aseg/' + this.idFicha])
  }

  EvalAfiliado(){
    
    this.router.navigate(['/app/afiliados/evaluacion/agregaEval'])

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
