import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-opcion-regresar',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './opcion-regresar.component.html',
  styleUrls: ['./opcion-regresar.component.css']
})



export class OpcionRegresarComponent implements OnInit {

  @Input() link: string;

  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
    
  }

}
