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
import { ReporteAsistenciasProgramadasComponent } from './components/reporte-asistencias-programadas/reporte-asistencias-programadas.component';
import { ReporteAsistenciaRapidaComponent } from './components/reporte-asistencia-rapida/reporte-asistencia-rapida.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
    declarations: [
        ReportesTalleristaComponent,
        TalleresComponent,
        DetalleAsistenciasTallerComponent,
        ReporteAsistenciasProgramadasComponent,
        ReporteAsistenciaRapidaComponent
    ],
    imports: [
        CommonModule,
        MenuOpcionesComponent,
        ReportesTalleristaRoutingModule,
        SharedModule,
        CdkTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatDialogModule
    ]
})
export class ReportesTalleristaModule { }
