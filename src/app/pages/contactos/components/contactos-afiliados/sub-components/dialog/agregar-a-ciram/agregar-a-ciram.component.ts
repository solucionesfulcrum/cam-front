import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'esp-agregar-a-ciram',
  templateUrl: './agregar-a-ciram.component.html',
  styleUrls: ['./agregar-a-ciram.component.scss']
})
export class AgregarACiramComponent {

  unid = JSON.parse(localStorage.getItem('UnidElegida')!);
  isDropdownOpen = false;
  selectedCiram: any = null;
  listCiram: any;

  public form = this.fb.nonNullable.group({
    idUnidadOperativa: ['', Validators.required]
  });


  constructor(@Inject(DIALOG_DATA) public data      : any,
 
  private _dialogRef                    : MatDialogRef<any>,
  private authService:AuthService,
  private fb : FormBuilder,
) {

}
/*
this.authService.getListarCiram(parseInt(this.unid.idUnidOperativa)).subscribe((data) => {
  ////console.log("dataciram",data)
  this.listCiram = data.data
})*/

ngOnInit(){
  if(localStorage.getItem('UnidElegida') != 'null'){
    this.authService.getListarCiram(parseInt(this.unid.idUnidOperativa)).subscribe((data) => {
      this.listCiram = data.data
    })
  }
}

onClose(){
this._dialogRef.close();
}

okBtn(){
  this.form.markAllAsTouched();
  if(this.form.valid){
    this._dialogRef.close({idUnidadOperativa: this.form.get('idUnidadOperativa')?.value});
  }
}

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

selectCiram(ciram: any) {
  this.selectedCiram = ciram;
  this.isDropdownOpen = false;
}

}
