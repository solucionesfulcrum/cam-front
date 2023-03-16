import { Component, Input, OnInit } from '@angular/core';
import { DataSelect } from './data-select.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  @Input() disabled = false;
  @Input() loading = false;
  @Input() deafultSelected: DataSelect  
  @Input() data: DataSelect[] 

  constructor() { }

  ngOnInit(): void {
  }

}