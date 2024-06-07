import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { DatosPerfilCiram } from '@models/adm-uo/adm-uo';
import { FormatoTab } from '@shared/components/menu-opciones/formato-tab.model';

@Component({
  selector: 'esp-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent {
  dataShow = false;
  faSpinner = faSpinner;
  id = 1;
  idUnidadOperativa: any = -1;
  datosPerfilCiram: DatosPerfilCiram = {
    nombre: 'Centro de Salud CIRAM Norte',
    idCentro: '23835688',
    tipo: 'CIRAM',
    fechaIncripcion: '14/04/1997',
    direccion: 'Andres Avelino Caceres Dorregaray/Huamanga/Ayacucho',
    distrito: '',
    nombreCam: 'CUSCO',
    nombreRed: 'CUSCO',
    lider: 'Juan José Silva Montalvo',
    celular: '949484895',
    estado: 1,
    correo: 'correo@gmail.com',
  };

  opcionesBotones: FormatoBoton[] = [
    { texto: 'Cancelar' },
    { texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg' },
  ];
  links : FormatoTab[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
   
  }

  ngOnInit() {
    
    
    this.idUnidadOperativa = this.activeRoute.snapshot.paramMap.get('idUnidadOperativa');

    this.links = [
      { url: `/app/adm-uo/edit/${this.idUnidadOperativa}/afiliados`, title: 'Afilidados' },
      { url: `/app/adm-uo/edit/${this.idUnidadOperativa}/talleres`, title: 'Talleres' },
      { url: `/app/adm-uo/edit/${this.idUnidadOperativa}/talleristas`, title: 'Talleristas' },
    ]

    
    this.authService.getPerfilCiram(this.idUnidadOperativa).subscribe((data) => {
      console.log('hola', data.data)
      if(data.data){
        this.datosPerfilCiram = data.data
      }
     
    })
  }

  editarCiram() {
    console.log("editar")
    this.router.navigate([`app/adm-uo/edit-ciram/${this.idUnidadOperativa}`])
  }
}
