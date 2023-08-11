import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'esp-menu-opciones',
  standalone:true,
  imports:[CommonModule, MatTabsModule, RouterModule],
  templateUrl: './menu-opciones.component.html',
  styleUrls: ['./menu-opciones.component.scss']
})
export class MenuOpcionesComponent implements OnInit{

  @Input()
  titulo: string='';

  @Input()
  links=[{url:'', title: ''}];

  @Input()
  setColorTab!: string;

  activeTab!: string;
  
  constructor(private route: ActivatedRoute,       
              private router: Router) {
  }
  
  ngOnInit(): void {
    this.activeTab = this.links[0].url;
    this.activeTab = this.getActiveLink(this.router.url);

    if(this.setColorTab != undefined){
      document.documentElement.style.setProperty('--color-tabs',this.setColorTab);
    }
  }
  getActiveLink(path:string)
  {
    let active = this.links[0].url;

    if (this.links.length > 1) {
      for (let i = 1; i < this.links.length; i++) {
        if ( path === this.links[i].url){
          active = this.links[i].url
        }
      }
    }
    
    return active
  }
}
