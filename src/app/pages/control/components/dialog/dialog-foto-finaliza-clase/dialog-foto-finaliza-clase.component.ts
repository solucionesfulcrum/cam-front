import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ControlProgramacionService } from 'src/app/data/services/control/control-programacion.service';

@Component({
  selector: 'esp-dialog-foto-finaliza-clase',
  templateUrl: './dialog-foto-finaliza-clase.component.html',
  styleUrls: ['./dialog-foto-finaliza-clase.component.scss']
})
export class DialogFotoFinalizaClaseComponent {
  selectedFile: File | null = null; // Archivo seleccionado
  loadingImage: boolean = false;
  rutaEvidencia: string = "";
  imagenUrl: string = "";
  imagenDetectada: string = "";
  waitImagenDeteccion = false;

  finalStep: boolean = false;
  faSpinner = faSpinner;

  constructor(
    public dialogRef: MatDialogRef<DialogFotoFinalizaClaseComponent>,
    private controlProgramacionService: ControlProgramacionService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { idAsisRapSesion: number } // Recibe el parámetro idAsisRapSesion
  ) {}

  // Método para cerrar el diálogo y devolver un resultado
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Método para cerrar el diálogo sin devolver datos
  onClose(): void {
    this.dialogRef.close();
  }

  // Método para disparar el input file cuando se haga clic en el área de subir foto
  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click(); // Simula el clic en el input file
  }

  // Método que se ejecuta cuando el usuario selecciona un archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos
    if (!validImageTypes.includes(file.type)) {
      this.toast.warning('Error: Solo se permiten archivos de imagen (JPG, PNG, GIF)')
      return; // Detener la subida si no es una imagen
    }
    

    if (file) {
      this.selectedFile = file;
      this.loadingImage = true;
      this.controlProgramacionService.subirEvidenciaAsistenciaRapida(this.selectedFile!, this.data.idAsisRapSesion).subscribe(
        (data) => {
          this.rutaEvidencia = data.data.rutaEvidencia;
          this.getImageDetect(this.selectedFile);
           // Ejecutar la descarga automáticamente después de subir el archivo
          this.downloadFile(); 
        },
        (error) => {
          this.loadingImage = false;
        }
      );
    }
  }

  getImageDetect(file: any){
    this.waitImagenDeteccion = true;
    if (this.rutaEvidencia) {
      this.controlProgramacionService.obtenerAsistentesAsistenciaRapida(file).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        this.imagenDetectada = url;
        this.waitImagenDeteccion = false;
      })
    }
  }

  downloadFile(): void {
    console.log(1)
    console.log(this.rutaEvidencia)
    if (this.rutaEvidencia) {
      console.log(2)
      this.loadingImage = true;
      this.controlProgramacionService.descargarEvidenciaAsistenciaRapida(this.data.idAsisRapSesion).subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          this.imagenUrl = url;  // Guardamos la URL para mostrar la imagen
          this.loadingImage = false;
          this.finalStep = true;
        },
        (error) => {
          this.loadingImage = false;
        }
      );
    }
  }

  vuelveATomarFoto(): void {
    this.rutaEvidencia = "";
    this.imagenUrl = "";
    this.imagenDetectada = "";
    this.continua(false);
  }

  continua(estado: boolean): void {
    this.finalStep = estado;
  }

  finaliza(): void {
    this.dialogRef.close({success: true});
  }
}
