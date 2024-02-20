import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {  RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '@services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,SidenavComponent, ToolbarComponent, RouterModule,SharedModule,MatSidenavModule ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  opened = true;
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    //this.authService.getProfile()
    //.subscribe();
  }

}
