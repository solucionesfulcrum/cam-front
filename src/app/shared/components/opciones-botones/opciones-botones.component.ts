import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormatoBoton } from './formato-boton.model';
import { ButtonComponent } from '../btn/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'esp-opciones-botones',
  templateUrl: './opciones-botones.component.html',
  styleUrls: ['./opciones-botones.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, ButtonComponent, MatTooltipModule],
})
export class OpcionesBotonesComponent {
  @Input()
  rutaRegreso: any = null;

  @Input()
  listOpciones: FormatoBoton[] = [];

  // Hasta encontrar como hacerlo dinamico se va a poner fijo --------------------------------------------------------------------------------------------------------------------------------------------------------------------

  @Output()
  firstFunction = new EventEmitter<any>();
  @Output()
  secondFunction = new EventEmitter<any>();
  @Output()
  thirdFunction = new EventEmitter<any>();
  @Output()
  fourthFunction = new EventEmitter<any>();
  @Output()
  fifthFunction = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(){
    
  }

  emitirFuncionesEstaticas(pos: number){
    switch (pos) {
      case 0:
        this.firstFunction.emit();
        break;
      case 1:
        this.secondFunction.emit();
        break;
      case 2:
        this.thirdFunction.emit();
        break;
      case 3:
        this.fourthFunction.emit();
        break;
      case 4:
        this.fifthFunction.emit();
        break;
    }
  }
}
