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
import { DetalleAsistenciasTallerComponent } from './detalle-asistencias-taller/detalle-asistencias-taller.component';
import { OpcionesBotonesComponent } from '@shared/components/opciones-botones/opciones-botones.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
    declarations: [
        ReportesTalleristaComponent,
        TalleresComponent,
        DetalleAsistenciasTallerComponent
    ],
    imports: [
        CommonModule,
        MenuOpcionesComponent,
        ReportesTalleristaRoutingModule,
        OpcionesBusquedaComponent,
        DataLoadingComponent,
        CdkTableModule,
        MatPaginatorModule,
        OpcionesBotonesComponent,
        MatTooltipModule,
        MatDialogModule
    ]
})
export class ReportesTalleristaModule { }
