import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionUsuarioRoutingModule } from './administracion-usuario-routing.module';
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component';
import { SharedModule } from '@shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    SelectUnidOperativaComponent,
    EditActiveUserComponent
  ],
  imports: [
    CommonModule,
    AdministracionUsuarioRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MaterialModule
  ]
})
export class AdministracionUsuarioModule { }
