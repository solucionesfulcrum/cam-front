import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionUsuarioRoutingModule } from './administracion-usuario-routing.module';
import { SelectUnidOperativaComponent } from './select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './edit-active-user/edit-active-user.component';
import { SharedModule } from '@shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from 'src/app/material/material.module';
import { SidenavAdminUserComponent } from './sidenav-admin-user/sidenav-admin-user.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { SeguridadComponent } from './seguridad/seguridad.component';

@NgModule({
  declarations: [
    SelectUnidOperativaComponent,
    EditActiveUserComponent,
    SidenavAdminUserComponent,
    NivelEducativoComponent,
    SeguridadComponent
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
