import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionUsuarioRoutingModule } from './administracion-usuario-routing.module';
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component';
import { SharedModule } from '@shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    SelectUnidOperativaComponent,
    EditActiveUserComponent
  ],
  imports: [
    CommonModule,
    AdministracionUsuarioRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class AdministracionUsuarioModule { }
