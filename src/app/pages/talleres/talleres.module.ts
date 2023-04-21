import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalleresLayoutComponent } from './talleres-layout.component';
import { TalleresRoutingModule } from './talleres-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { BtnComponent } from 'src/app/shared/components/btn/btn.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AnalisisComponent} from './analisis/analisis.component';
import { ProgramacionComponent } from './programacion/programacion.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { TalleristasComponent } from './talleristas/talleristas.component';
import { CiramsComponent } from './cirams/cirams.component';
import { ShowProgramacionTallerComponent } from './show-programacion-taller/show-programacion-taller.component';



@NgModule({
  declarations: [
    TalleresLayoutComponent,
    AnalisisComponent,
    ProgramacionComponent,
    ServiciosComponent,
    TalleristasComponent,
    CiramsComponent,

    ShowProgramacionTallerComponent, 
  ],
  imports: [
    CommonModule,
    TalleresRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
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
    MatSnackBarModule,


  ],
  exports:[
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule
  ],
})
export class TalleresModule { }
