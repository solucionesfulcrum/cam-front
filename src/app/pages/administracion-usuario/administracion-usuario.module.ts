import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component'
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component'
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    EditActiveUserComponent,
    SelectUnidOperativaComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AdministracionUsuarioModule { }
