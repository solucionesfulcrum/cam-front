import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../btn/button.component';
import { FiltroFechaComponent } from '../filtro-fecha/filtro-fecha.component';
import { IconComponent } from '../icon/icon.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone:true,
  imports:[CommonModule,FormsModule, CdkMenuModule, FiltroFechaComponent, IconComponent, ButtonComponent, ReactiveFormsModule, FontAwesomeModule],
  selector: 'esp-data-loading',
  templateUrl: './data-loading.component.html',
  styleUrls: ['./data-loading.component.scss']
})
export class DataLoadingComponent {
  @Input('dataLoading') dataLoading : boolean = false;
  @Input('dataLoadingMsg') dataLoadingMsg : string = "Obteniendo datos...";
  @Input('dataEmpty') dataEmpty : boolean = false;
  @Input('dataEmptyMsg') dataEmptyMsg : string = "No existen registros.";
  @Input('height') height : string = "70.5vh";

  faSpinner = faSpinner;

}
