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
  @Input() color:  'success' | 'primary' |'secondary' | 'danger' | 'light' | 'sky' =
    'primary';
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
      'hover:bg-primary-800': true,
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
    secondary: {
      'bg-slate-200': true,
      'hover:bg-slate-500': true,
      'focus:ring-slate-50': true,
      'text-slate-700': true,
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
