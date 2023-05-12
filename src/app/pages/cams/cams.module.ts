import { NgModule } from '@angular/core';
import { CamsRoutingModule } from './cams-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CamsLayoutComponent } from './cams-layout.component';
import { CamsComponent } from './cams/cams.component';
import { CiramsComponent } from './cirams/cirams.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ShowCamComponent } from './show-cam/show-cam.component';
import { EditCamComponent } from './edit-cam/edit-cam.component';
import { SubListCiramsCamComponent } from './show-cam/sub-list-cirams-cam/sub-list-cirams-cam.component';
import { SubViewCiramsCamComponent } from './show-cam/sub-view-cirams-cam/sub-view-cirams-cam.component';
import { SubListUsuariosCamComponent } from './show-cam/sub-list-usuarios-cam/sub-list-usuarios-cam.component';
import { SubViewUsuariosCamComponent } from './show-cam/sub-view-usuarios-cam/sub-view-usuarios-cam.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SubListProgramasCamComponent } from './show-cam/sub-list-programas-cam/sub-list-programas-cam.component';
import { SubViewProgramasCamComponent } from './show-cam/sub-view-programas-cam/sub-view-programas-cam.component';
import { NewCamComponent } from './new-cam/new-cam.component';
import { ProgramasComponent } from './programas/programas.component';
import { RedesComponent } from './redes/redes.component';
import { UbigeosComponent } from './ubigeos/ubigeos.component';
import { ShowCiramComponent } from './show-ciram/show-ciram.component';
import { ShowRedComponent } from './show-red/show-red.component';
import { ShowUbigeoComponent } from './show-ubigeo/show-ubigeo.component';
import { SubViewUsuariosCiramComponent } from './show-ciram/sub-view-usuarios-ciram/sub-view-usuarios-ciram.component';
import { SubListUsuariosCiramComponent } from './show-ciram/sub-list-usuarios-ciram/sub-list-usuarios-ciram.component';
import { SubViewProgramasCiramComponent } from './show-ciram/sub-view-programas-ciram/sub-view-programas-ciram.component';
import { SubListProgramasCiramComponent } from './show-ciram/sub-list-programas-ciram/sub-list-programas-ciram.component';
import { EditCiramComponent } from './edit-ciram/edit-ciram.component';
import { NewCiramComponent } from './new-ciram/new-ciram.component';
import { NewServicioComponent } from './new-servicio/new-servicio.component';
import { EditServicioComponent } from './edit-servicio/edit-servicio.component';
import { ShowServicioComponent } from './show-servicio/show-servicio.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubViewUsuariosRedComponent } from './show-red/sub-view-usuarios-red/sub-view-usuarios-red.component';
import { SubListUsuariosRedComponent } from './show-red/sub-list-usuarios-red/sub-list-usuarios-red.component';
import { SubViewCamsRedComponent } from './show-red/sub-view-cams-red/sub-view-cams-red.component';
import { SubListCamsRedComponent } from './show-red/sub-list-cams-red/sub-list-cams-red.component';
import { EditRedComponent } from './edit-red/edit-red.component';
import { UsersLayoutComponent } from '../users/users-layout.component';
import { BtnComponent } from 'src/app/shared/components/btn/btn.component';
import { MatSelectModule } from '@angular/material/select';
import { NewRedComponent } from './new-red/new-red.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    CamsLayoutComponent,
    CamsComponent,
    CiramsComponent,
    ServiciosComponent,
    ShowCamComponent,
    EditCamComponent,
    SubViewProgramasCamComponent,
    SubViewCiramsCamComponent,
    SubViewUsuariosCamComponent,
    SubListProgramasCamComponent,
    SubListCiramsCamComponent,
    SubListUsuariosCamComponent,
    NewCamComponent,
    ProgramasComponent,
    RedesComponent,
    UbigeosComponent,
    ShowCiramComponent,
    ShowRedComponent,
    ShowUbigeoComponent,
    SubViewUsuariosCiramComponent,
    SubListUsuariosCiramComponent,
    SubViewProgramasCiramComponent,
    SubListProgramasCiramComponent,
    EditCiramComponent,
    NewCiramComponent,
    NewServicioComponent,
    EditServicioComponent,
    ShowServicioComponent,

    SubViewUsuariosRedComponent,
    SubListUsuariosRedComponent,
    SubViewCamsRedComponent,
    SubListCamsRedComponent,

    EditRedComponent,
    NewRedComponent,
  ],
  imports: [
    CamsRoutingModule,
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
    MatAutocompleteModule,
    MatDividerModule,
    MatExpansionModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    BtnComponent,
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
  ],
  providers: [],
})
export class CamsModule {}
