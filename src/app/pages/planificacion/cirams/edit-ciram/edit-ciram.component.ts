import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-ciram',
  templateUrl: './edit-ciram.component.html',
  styleUrls: ['./edit-ciram.component.css']
})
export class EditCiramComponent implements OnInit {
  demo1TabIndex = 1;
  imgPrevisualizada: string;
  archivos: any[] = [];
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  salir(): void {
    this.router.navigate(['/planificacion']);
  }

  capturarFile(event: any): void {
    console.log(event.target.files);
    const archivoCap = event.target.files[0];
    this.extraerBase64(archivoCap).then((imagen: any) => {
      console.log(imagen);
      this.imgPrevisualizada = imagen.base;
    });
    this.archivos.push(archivoCap);
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const imagen = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        return (reader.onload = () => {
          resolve({
            base: reader.result,
          });
        });
      } catch (error) {
        return error;
      }
    });

}
