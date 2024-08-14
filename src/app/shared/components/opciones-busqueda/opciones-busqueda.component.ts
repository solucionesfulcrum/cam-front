import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParamMenu, Parametro } from './parametros-busqueda.model';
import { FiltroFechaComponent } from '../filtro-fecha/filtro-fecha.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../btn/button.component';
import { debounceTime } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'esp-opciones-busqueda',
  standalone:true,
  imports:[CommonModule,FormsModule, CdkMenuModule, FiltroFechaComponent, IconComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './opciones-busqueda.component.html',
  styleUrls: ['./opciones-busqueda.component.scss']
})
export class OpcionesBusquedaComponent{
  //Show Opciones----------------------------------------------------------------------------------------------------------------
  @Input()
  showDateFilter = false;

  @Input()
  showSearch = false;

  @Input()
  showFirstDisplayFilter = false;

  @Input()
  showSecondDisplayFilter = false;

  @Input()
  showThirdDisplayFilter = false;

  @Input()
  showButton = false;

  //Filtro de Fecha----------------------------------------------------------------------------------------------------------------
  @Input()
  filterDateAppearance: number = 1; // 1: DateFilter - 2: DateFilterWithCeros - 3: DateFilterWithoutCeros - 4: DateFilterUSDate
  
  @Input()
  setFilterDateSelectionBg!: string;

  @Input()
  setFilterDateButtonBg!: string;

  @Input()
  setFilterDateOptionSelected!: string;

  @Input()
  setFilterDateTextColour!: string;

  @Input()
  setDateSelectedDefault!: number;

  @Output()
  sendDateFilter = new EventEmitter<any>();
  
  @Output()
  sendDateFilterWithCeros = new EventEmitter<any>();

  @Output()
  sendDateFilterWithoutCeros = new EventEmitter<any>();

  @Output()
  sendDateFilterUSDate = new EventEmitter<any>();

  //Filtro de Búsqueda-------------------------------------------------------------------------------------------------------------
  @Input()
  searchInputPlaceHolder: string = 'Buscar';

  @Input()
  searchInputAdjustWidth: boolean = false;

  @Output()
  searchInputValue = new EventEmitter<any>();

  //Primer Filtro Desplazable-------------------------------------------------------------------------------------------------------------
  @Input()
  firstDisplayFilterPlaceholder: {
    indicador: boolean, // Indica si es "True": Seleccionable o "False": No Seleccionable
    placeholder: string // Nombre de la opción
  } = {indicador: false, placeholder: 'Opciones'};

  @Input()
  firstDisplayFilterData: Parametro[] = [];

  @Output()
  firstDisplayFilterSendValue = new EventEmitter<any>();

  @Input()
  firstDisplaySelectedValue: boolean = true;

  //Segundo Filtro Desplazable-------------------------------------------------------------------------------------------------------------
  @Input()
  secDisplayFilterPlaceholder: {
    indicador: boolean, // Indica si es "True": Seleccionable o "False": No Seleccionable
    placeholder: string // Nombre de la opción
  } = {indicador: false, placeholder: 'Opciones'};

  @Input()
  secDisplayFilterData: Parametro[] = [];

  @Output()
  secDisplayFilterSendValue = new EventEmitter<any>();

   //Segundo Filtro Desplazable-------------------------------------------------------------------------------------------------------------
   @Input()
   thirdDisplayFilterPlaceholder: {
     indicador: boolean, // Indica si es "True": Seleccionable o "False": No Seleccionable
     placeholder: string // Nombre de la opción
   } = {indicador: false, placeholder: 'Opciones'};
 
   @Input()
   thirdDisplayFilterData: Parametro[] = [];
 
   @Output()
   thirdDisplayFilterSendValue = new EventEmitter<any>();
 

  //Botón ejecutable-------------------------------------------------------------------------------------------------------------------------
  @Input()
  buttonBg: string = '';

  @Input()
  buttonText: string = 'Añadir';

  @Output()
  buttonAccion = new EventEmitter<any>();

  // Menú Desplegable-------------------------------------------------------------------------------------------------------------------------
  @Input()
  menuOpt: ParamMenu[] = [];

  @Output()
  primerActionMenu = new EventEmitter<any>();

  @Output()
  segundoActionMenu = new EventEmitter<any>();

  @Output()
  tercerActionMenu = new EventEmitter<any>();

  //Variables del componente-------------------------------------------------------------------------------------------------------------
  form:FormGroup = this.fb.group({
    frmSearchDate:new FormControl(""),
    frmSearch:new FormControl("")
  });
  @ViewChild('preSelected') nameInput!: ElementRef;
  
  public get searchForm(){
    return this.form.get("frmSearch");
  }

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    if(this.buttonBg != undefined){
      document.documentElement.style.setProperty('--color-boton',this.buttonBg);
    }
    this.onFilter();
  }

  ngAfterViewInit(){
    if (this.nameInput) {
      this.nameInput.nativeElement.focus();
    }
  }

  setDateFilter(value: any){
    if (this.filterDateAppearance == 1) {
      this.form.get('frmSearchDate')?.setValue(value);
      this.sendDateFilter.emit(value);
    }
  }
  
  setDateFilterWithCeros(value: any){
    if (this.filterDateAppearance == 2) {
    this.form.get('frmSearchDate')?.setValue(value);
    this.sendDateFilterWithCeros.emit(value);
  }
  }
  
  setDateFilterWithoutCeros(value: any){
    if (this.filterDateAppearance == 3) {
    this.form.get('frmSearchDate')?.setValue(value);
    this.sendDateFilterUSDate.emit(value);
  }
  }
  
  setDateFilterUSDate(value: any){
    if (this.filterDateAppearance == 4) {
    this.form.get('frmSearchDate')?.setValue(value);
    this.sendDateFilterUSDate.emit(value);
  }
  }
  onFilter(){
    this.searchForm?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      (key:string) => {
        this.searchInputValue.emit(this.searchForm?.value)
      }
    )
  }
  changeFirstFilter(value: any){
    this.firstDisplayFilterSendValue.emit(value);
  }
  changeSecondFilter(value: any){
    this.secDisplayFilterSendValue.emit(value);
  }
  changeThirdFilter(value: any){
    this.secDisplayFilterSendValue.emit(value);
  }
}
