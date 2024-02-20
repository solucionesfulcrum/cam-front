import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pregunt1opc',
  standalone: true,
  templateUrl: './pregunt1opc.component.html',
  styleUrls: ['./pregunt1opc.component.css']
})
export class Pregunt1opcComponent implements OnInit {

  @Input() textEval!: string;

  constructor() { }

  ngOnInit(): void {
  }

}

