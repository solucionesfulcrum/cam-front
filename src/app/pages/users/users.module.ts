import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';



import { UsersLayoutComponent } from './users-layout.component';
import { BtnComponent } from 'src/app/shared/components/btn/btn.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { NewUserComponent } from './new-user/new-user.component';
import { RolesComponent } from './roles/roles.component';
import { ShowRoleComponent } from './show-role/show-role.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { UsersComponent } from './users/users.component';
import { SubListActivacionesUserComponent } from './show-user/sub-list-activaciones-user/sub-list-activaciones-user.component';
import {MatCardModule} from '@angular/material/card';
import { ModalActivarUsuarioComponent } from './show-user/modalActivar/modal-activar-usuario.component';
import { MenuOpcionesComponent } from 'src/app/shared/components/menu-opciones/menu-opciones.component';
import { OpcionesBusquedaComponent } from 'src/app/shared/components/opciones-busqueda/opciones-busqueda.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FiltroFechaComponent } from 'src/app/shared/components/filtro-fecha/filtro-fecha.component';
import { IconComponent } from '@shared/components/icon/icon.component';



@NgModule({
  declarations: [
    UsersLayoutComponent,

    EditUserComponent,
    EditRoleComponent,
    NewRoleComponent,
    NewUserComponent,
    RolesComponent,
    ShowRoleComponent,
    ShowUserComponent,
    UsersComponent,

    SubListActivacionesUserComponent,
    ModalActivarUsuarioComponent,
    



  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
    MatTabsModule,
    MatPaginatorModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatExpansionModule,
    BtnComponent,
    IconComponent,
    MenuOpcionesComponent,
    OpcionesBusquedaComponent,
    FiltroFechaComponent,
    MatSnackBarModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports:[
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule
  ],
  providers: [
  ],
})
export class UsersModule { }
