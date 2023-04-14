import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RequestStatus } from 'src/app/core/_model/request-status.model';

@Component({
  selector: 'app-modal-activar-usuario',
  templateUrl: './modal-activar-usuario.component.html',
  styleUrls: ['./modal-activar-usuario.component.css'],
})
export class ModalActivarUsuarioComponent implements OnInit {
form = this.formBuilder.nonNullable.group({
    fechaInicio: ['', [ Validators.required ]],
    fechaFin: ['', [ Validators.required ]],
    roles: ['', [ Validators.required ]],
})

  status: RequestStatus = 'init';
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalActivarUsuarioComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('from MODAL, parent: ', data.user);
  }

  ngOnInit(): void {}

  getClassRow(i: number): string {
    let row = '';
    if (i % 2 != 0) row = 'rowColor';
    return row;
  }
}
