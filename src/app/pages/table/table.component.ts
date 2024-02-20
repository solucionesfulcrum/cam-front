import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { DataSource} from '@angular/cdk/collections'
import {CdkTableModule} from '@angular/cdk/table';
import {DataSourceProduct} from './data-source'
import { Product } from './product.model';
import { ButtonComponent } from 'src/app/shared/components/btn/button.component';
import { ReactiveFormsModule} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, CdkTableModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  dataSource = new DataSourceProduct();
  columns: string[] = ['#No', 'Name', 'price', 'cover', 'actions'];
  total = 0;
  input = new FormControl("", {nonNullable: true})

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<Product[]>('https://api.escuelajs.co/api/v1/products')
    .subscribe(data => {
      this.dataSource.init(data);
      this.total = this.dataSource.getTotal();
    })

    this.input.valueChanges
    .pipe(
      debounceTime(300)
    )
    .subscribe(val =>{
      this.dataSource.find(val)
    })
  }

  update(product: Product) {
    this.dataSource.update(product.id, { price: 20 });
  }

}