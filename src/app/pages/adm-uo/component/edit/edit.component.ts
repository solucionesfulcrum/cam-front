import { Component } from '@angular/core';
import { FormatoBoton } from '@shared/components/opciones-botones/formato-boton.model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'esp-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  dataShow = false;
  faSpinner = faSpinner;
  id = 1;
  idUnidadOperativa: any;
  datosPerfilCiram: any;

  opcionesBotones: FormatoBoton[] = [
    { texto: 'Cancelar' },
    { texto: 'Editar', esImagen: true, rutaIcono: 'assets/svg/iconFileEdit.svg' },
  ];
  links = [
    { url: `/app/adm-uo/edit/show/${this.id}`, title: 'Afilidados' },
    { url: `/app/adm-uo/edit/show/${this.id}`, title: 'Talleres' },
    { url: `/app/adm-uo/edit/show/${this.id}`, title: 'Talleristas' },
  ]

  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.idUnidadOperativa = this.activeRoute.snapshot.paramMap.get('idUnidadOperativa');
  }

  ngOnInit() {
    this.authService.getPerfilCiram(this.idUnidadOperativa).subscribe((data) => {
      console.log('hola', data.data)
      this.datosPerfilCiram = data.data
    })
  }

  editarCiram() {
    console.log("editar")
    this.router.navigate([`app/adm-uo/edit-ciram/${this.idUnidadOperativa}`])
  }
}
