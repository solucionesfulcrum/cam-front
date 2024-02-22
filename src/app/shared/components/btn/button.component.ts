import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';


@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, CdkStepperModule, NgStepperModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {

  @Input() disabled = false;
  @Input() loading = false;
  @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
  @Input() color: 'success' | 'primary' | 'danger' | 'light' | 'cancel' | 'sky' | "white" | "mezclado" | 'transparente' | 'transparenteCancel' | "bordeado" | "none" =
    'primary';
  @Input() style = {};
  faSpinner = faSpinner;

  mapColors = {
    success: {
      'bg-success-700': true,
      'hover:bg-success-800': true,
      'focus:ring-success-300': true,
      'text-white': true,
    },
    primary: {
      'bg-primary-700': true,
      'hover:bg-[#057EC9]': true,
      'focus:ring-primary-300': true,
      'text-white': true,
    },
    danger: {
      'bg-danger-700': true,
      'hover:bg-danger-800': true,
      'focus:ring-danger-300': true,
      'text-white': true,
    },
    light: {
      'bg-gray-200': true,
      'hover:bg-gray-500': true,
      'focus:ring-gray-50': true,
      'text-gray-700': true,
    },
    cancel: {
      'bg-gray-200': true,
      'hover:bg-gray-300': true,
      'focus:ring-gray-50': true,
      'text-gray-700': true,
    },
    white: {
      'bg-white': true,
      'hover:bg-gray-100': true,
      'ring-gray-50': true,
      'text-gray-700': true,
    },
    sky: {
      'bg-sky-700': true,
      'hover:bg-sky-800': true,
      'focus:ring-sky-300': true,
      'text-white': true,
    },
    mezclado: {
      'bg-sigps': true,
      'text-white': true,
    },
    transparente: {
      'bg-transparent': true,
      'text-Name': true,
      'border-[var(--color-CAM)]': true,
      'border-[0.0125rem]': true,
      'hover:bg-gray-300': true,
      'focus:ring-gray-500': true,
    },
    bordeado: {
      'bg-white': true,
      'text-[var(--color-CAM-black-alt)]': true,
      'border-[var(--color-CAM)]': true,
      'border-[0.0125rem]': true,
      'hover:bg-gray-300': true,
      'focus:ring-gray-500': true,
    },
    transparenteCancel: {
      'bg-transparent': true,
      'text-red-500': true,
      'border-red-500': true,
      'border-[0.0125rem]': true,
      'hover:bg-gray-100': true,
      'focus:ring-gray-100': true,
    },
    none:{}
  };

  constructor() {}

  get colors() {
    let colors = this.mapColors[this.color];
    if (this.color != "none") {
      if (colors) {
        colors = {...colors,...this.style}
        if(this.disabled) colors = {...colors, ...{'opacity-50': true}};
        return colors;
      }
    }
    return this.style;
  }


}
