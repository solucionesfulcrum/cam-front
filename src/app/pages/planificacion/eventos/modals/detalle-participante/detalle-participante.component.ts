import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-participante',
  templateUrl: './detalle-participante.component.html',
  styleUrls: ['./detalle-participante.component.css']
})
export class DetalleParticipanteComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DetalleParticipanteComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  editarMiembroEquipo(): void {
    this.dialogRef.close();
  }
}
