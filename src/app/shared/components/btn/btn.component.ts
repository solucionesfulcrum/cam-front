import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    
  ],
  styleUrls: ['./btn.component.css']
})

export class BtnComponent implements OnInit {

  @Input() disabled = false;
  @Input() loading = false;
  @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
  @Input() color:  'success' | 'primary' |'secondary' | 'danger' | 'light' | 'cancel' | 'sky' | "white" | "mezclado" | 'bordeado' | 'transparenteCancel' | "none" =
    'primary';
  faSpinner = faSpinner;

  mapColors = {
    success: {
      'bg-green-700': true,
      'hover:bg-green-800': true,
      'focus:ring-green-300': true,
      'text-white': true,
    },
    primary: {
      'bg-sky-600': true,
      'hover:bg-sky-700': true,
      'focus:ring-sky-100': true,
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
    secondary: {
      'bg-slate-200': true,
      'hover:bg-slate-500': true,
      'focus:ring-slate-50': true,
      'text-slate-700': true,
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
      
      //'customer-btn-bg-sky': true, //700
      //'customer-btn-border-sky':true,
      //'customer-btn-text-sky': true,
    },
    mezclado: {
      'bg-cam': true,
      'text-white': true,
    },
    bordeado: {
      'bg-white': true,
      'text-[var(--color-CAM-black-alt)]': true,
      'border-[var(--color-CAM)]': true,
      'border-[0.0125rem]': true,
      'hover:bg-gray-500': true,
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
    const colors = this.mapColors[this.color];
    if (colors) {
      return colors;
    }
    return {};
  }

  ngOnInit(): void {
  }

}
