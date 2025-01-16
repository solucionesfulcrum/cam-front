import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { HttpClient } from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-scroll',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, ScrollingModule],
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.css']
})
export class ScrollComponent implements OnInit{
  products: Product[] = [];

  constructor(private http: HttpClient){

  }

  ngOnInit(): void {
    this.http.get<Product[]>('https://api.escuelajs.co/api/v1/products')
    .subscribe(data => {
      this.products = data;
    })
  }
   
}
