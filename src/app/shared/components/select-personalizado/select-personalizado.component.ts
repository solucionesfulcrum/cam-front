import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../btn/button.component';
import { FiltroFechaComponent } from '../filtro-fecha/filtro-fecha.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'esp-select-personalizado',
  standalone: true,
  templateUrl: './select-personalizado.component.html',
  styleUrls: ['./select-personalizado.component.scss'],
  imports:[CommonModule,FormsModule, CdkMenuModule, FiltroFechaComponent, IconComponent, ButtonComponent, ReactiveFormsModule],
})
export class SelectPersonalizadoComponent {
  @Input() options: any[] = [];
  @Input() placeholder: string = 'Select an option';
  @Output() optionSelected = new EventEmitter<any>();

  selectedOption: any;
  dropdownOpen: boolean = false;

  constructor(private eRef: ElementRef){
    
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.optionSelected.emit(option);
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
