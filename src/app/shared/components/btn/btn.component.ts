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
      'customer-btn-bg-success': true, //700
      'customer-btn-border-success':true,
      'customer-btn-text-success': true,
    },
    primary: {
      'customer-btn-bg-primary': true, //700
      'customer-btn-border-primary':true,
      'customer-btn-text-primary': true,
    },
    danger: {
      'customer-btn-bg-danger': true, //700
      'customer-btn-border-danger':true,
      'customer-btn-text-danger': true,
    },
    light: {
      'customer-btn-bg-light': true, //700
      'customer-btn-border-light':true,
      'customer-btn-text-light': true,
    },
    secondary: {
      'customer-btn-bg-secondary': true, //700
      'customer-btn-border-secondary':true,
      'customer-btn-text-secondary': true,
    },
    sky: {
      'customer-btn-bg-sky': true, //700
      'customer-btn-border-sky':true,
      'customer-btn-text-sky': true,
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
