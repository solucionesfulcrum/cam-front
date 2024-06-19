import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesTalleristaComponent } from './reportes-tallerista/reportes-tallerista.component';
import { MenuOpcionesComponent } from "../../shared/components/menu-opciones/menu-opciones.component";
import { ReportesTalleristaRoutingModule } from './reportes-tallerista-routing.module';
import { TalleresComponent } from './talleres/talleres.component';
import { OpcionesBusquedaComponent } from '@shared/components/opciones-busqueda/opciones-busqueda.component';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
    declarations: [
        ReportesTalleristaComponent,
        TalleresComponent
    ],
    imports: [
        CommonModule,
        MenuOpcionesComponent,
        ReportesTalleristaRoutingModule,
        OpcionesBusquedaComponent,
        DataLoadingComponent,
        CdkTableModule,
        MatPaginatorModule
    ]
})
export class ReportesTalleristaModule { }
