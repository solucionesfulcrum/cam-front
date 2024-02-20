import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntas',
  standalone: true,
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})

export class PreguntasComponent implements OnInit {

  @Input() textEval!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
