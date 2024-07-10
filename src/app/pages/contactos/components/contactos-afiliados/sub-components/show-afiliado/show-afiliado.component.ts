import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@services/notification.service';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { capitalizar } from '@utils/capitalizador';
import { ToastrService } from 'ngx-toastr';
import { AfiliacionesSolicitudesService } from 'src/app/data/services/afiliaciones/afiliaciones-solicitudes.service';
import { ContactosAfiliadosService } from 'src/app/data/services/contactos/contactos-afiliados.service';
import { DatosGeneralesService } from 'src/app/data/services/datos-generales.service';
import { DarDeBajaService } from 'src/app/events/control/dar-de-baja.service';
import { FormularioBajaComponent } from 'src/app/pages/afiliados/dar-de-baja/formulario-baja/formulario-baja.component';
import { RespuestaDarDeBajaComponent } from 'src/app/pages/afiliados/dar-de-baja/respuesta-dar-de-baja/respuesta-dar-de-baja.component';
import { DialogNotasComponent } from 'src/app/pages/afiliados/show-sol/dialog-notas/dialog-notas.component';

@Component({
  selector: 'app-show-afiliado',
  templateUrl: './show-afiliado.component.html',
  styleUrls: ['./show-afiliado.component.css']
})
export class ShowAfiliadoComponent implements OnInit {
  opcionesBotones: FormatoBoton[] = [
    {texto: 'Notas', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg'},
    {texto: 'Actualizar Datos', esImagen: true, rutaIcono: 'assets/svg/icon-edit-data.svg'},
    {texto: 'Dar de Baja', esImagen: true, rutaIcono: 'assets/svg/dar-de-baja.svg', colorBtn: 'bordeado'},
  ];
  idUnidadOperativaUser = (JSON.parse(localStorage.getItem('UnidElegida')!)).idUnidOperativa;

  faSpinner = faSpinner;
  edadPersona: number = 0;
  idFicha: string = '';
  dataFichaAfiliado: any = Object();
  direccionActual: any = Object();
  dataShow = false;
  buscaAfiliado : boolean = false;
  fechaVigencia: string = '';

  links=[
    {url:`/app/contactos/show/${this.idFicha}`, title:'Operaciones'},
    {url:`/app/contactos/show/${this.idFicha}/evaluaciones`, title:'Evaluaciones'}
  ]

  constructor(private router                        : Router,
              private activeRoute                   : ActivatedRoute,
              private aseguradoServices             : ContactosAfiliadosService,
              private datosGeneralesServices        : DatosGeneralesService,
              private dialog                        : Dialog,
              private matDialog                        : MatDialog,
              private notificationService           : NotificationService,
              private afiliadoServices              : AfiliacionesSolicitudesService,
              private toastService : ToastrService,
              private eventoDarDeBaja: DarDeBajaService,
              private datosService: DatosGeneralesService,
            ) { 
      this.idFicha = this.activeRoute.snapshot.paramMap.get('idFicha')!;
      this.links[0].url = `/app/contactos/show/${this.idFicha}`;
      this.links[1].url = `/app/contactos/show/${this.idFicha}/evaluaciones`;

       // Verificar si la ruta contiene la palabra "busqueda"
       /*
        if(this.router.getCurrentNavigation()?.extras.state){
        if(this.router.getCurrentNavigation()?.extras.state!['esConsulta']){
         
        }
      }
       */
      if (this.router.url.includes('busqueda')) {
        this.buscaAfiliado = true;
        this.opcionesBotones = [];
        this.links=[
          {url:`/app/contactos/busqueda/${this.idFicha}`, title:'Operaciones'},
          {url:`/app/contactos/busqueda/${this.idFicha}/evaluaciones`, title:'Evaluaciones'},
          {url:`/app/contactos/busqueda/${this.idFicha}/notas`, title:'Notas'}
        ]
      }
     
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

        
        //console.log(data.data)
        this.dataFichaAfiliado = data.data;

        let tipoDoc = this.dataFichaAfiliado.asegurado.tipoDoc;
        this.aseguradoServices.servicioObtenerCodCentro({codOpcion: "1",
          numDoc: String(this.dataFichaAfiliado.asegurado.numDoc),
         tipoDoc}).subscribe(response=>{
           this.fechaVigencia = response.data.dataAfiliado[0].fecVigHasta
       })
       
        
        if(this.dataFichaAfiliado.fichaAdmision.estado != "13" && this.dataFichaAfiliado.fichaAdmision.estado != "14" && !this.buscaAfiliado){
          //this.opcionesBotones[0].deshabilitado = true;
          this.opcionesBotones[1].deshabilitado = true;
          this.opcionesBotones[2].deshabilitado = true;
        }
        /*if (this.dataFichaAfiliado.fichaAdmision.datosAfiliacion.estadoAfi !== 'ACTIVO') {
          this.opcionesBotones[2].deshabilitado = true;
        }*/
        var dateObject = new Date(data.data.asegurado.fecNacimiento); 
        var timeDiff = Math.abs(Date.now() - dateObject.getTime());
        this.edadPersona = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        data.data.fichaAdmision.direccion.forEach((x: any) => {
          if(x.activo == 1) {
            this.direccionActual = x;
            this.datosGeneralesServices.searchByUbigeo(x.codUbiDep + x.codUbiProv + x.codUbiDist).subscribe((datos)=>{
              if (datos.code == 0) {
                this.direccionActual.localizacion = datos.data.region + ' - ' + datos.data.provincia + ' - ' + datos.data.distrito;
              }
              else{
                this.notificationService.warning(datos.message);
              }
            })
          }
        });

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
    this.opcionesBotones[2].loading = true;
    this.datosGeneralesServices.validarAdmisionIngreso(this.dataFichaAfiliado.asegurado.tipoDoc, this.dataFichaAfiliado.asegurado.numDoc, this.idUnidadOperativaUser, 2).subscribe((data)=>{
      if (data.code == 0) {
        this.opcionesBotones[2].loading = false;
        if (data.data.acreditado) {
          localStorage.setItem('idFichaEvaluada', this.dataFichaAfiliado.fichaAdmision.idFichaAdmision);
          localStorage.setItem('datosEvaluacion', JSON.stringify({tipoEvaluacion: 'FICHA_ADMISION', idOrigen: parseInt(this.idFicha)}));
          this.router.navigate(['/app/afiliados/evaluacion/agregaEval'])
        }
        else{
          this.notificationService.warning(data.data.mensaje);
        }
      }
      else{
        this.opcionesBotones[2].loading = false;
        this.notificationService.warning(data.message);
      }
    });
  }

  Notas(){
    const dialogRef = this.dialog.open(DialogNotasComponent,{
      minWidth:'800px',
      maxWidth:'50%',        
      data:{
        idSolicitud: this.dataFichaAfiliado.fichaAdmision.idFichaAdmision,
        estadoAfi: this.dataFichaAfiliado.fichaAdmision.datosAfiliacion.estadoAfi,
        estado: this.dataFichaAfiliado.fichaAdmision.estado
      }
    })
    dialogRef.closed.subscribe(out =>{
      // //console.log(out)
    })
  }


  levantarModalDarDeBaja(){
    const dialogRef = this.matDialog.open(FormularioBajaComponent,{
      minWidth:'800px',
      maxWidth:'50%',     
    })
    dialogRef.afterClosed().subscribe(response=>{
      if(response.success){
        const nombreAfiliado: string =  this.dataFichaAfiliado.asegurado.nombres + " " + this.dataFichaAfiliado.asegurado.apePaterno + ' ' + this.dataFichaAfiliado.asegurado.apeMaterno;
        this.levantarModalConfirmacionBaja(capitalizar(nombreAfiliado), response.data.motivo,response.data.txtMotivo, response.data.descripcion);
      }
    })
  }

  levantarModalConfirmacionBaja(afiliado: string, motivo: number, txtMotivo: string, observacion: string){
    const dialogRef = this.matDialog.open(RespuestaDarDeBajaComponent,{
      minWidth:'500px',    
      maxWidth:'45%',    
      data:{
        afiliado,
        motivo,
        txtMotivo,
        observacion,
      }
    })
    dialogRef.afterClosed().subscribe(response=>{
      setTimeout(()=>{
        //aseguradoServices
        if(response.success){
          this.aseguradoServices.darDeBajaAsegurado({
            idFichaAdmision: this.dataFichaAfiliado.fichaAdmision.idFichaAdmision,
            idMotivoBaja: motivo,
            descMotivoBaja: observacion,
            idUsuarioReg: JSON.parse(localStorage.getItem('camUser')!).idUsuario
          }).subscribe(response=>{
            if(response.code == 0){
              this.toastService.success("Se ha dado de baja al afiliado")
              //this.opcionesBotones[0].deshabilitado = true;
              this.opcionesBotones[1].deshabilitado = true;
              this.opcionesBotones[2].deshabilitado = true;
              this.dataFichaAfiliado.fichaAdmision.datosAfiliacion.estadoAfi = 'BAJA';
              this.eventoDarDeBaja.emitirEvento("ok");
            }else{
              this.toastService.warning(response.message)
            }
          })
        }
      })
    
    })
  }

}
