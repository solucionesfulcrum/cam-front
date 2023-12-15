import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormatoTab } from './formato-tab.model';
import { filter } from 'rxjs';

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
  showBottomLine: boolean = true;

  @Input()
  links: FormatoTab[] = [];

  @Input()
  setColorTab!: string;

  tituloReflejado: FormatoTab = Object();

  activeTab!: string;
  
  constructor(private route: ActivatedRoute,       
              private router: Router) {
  }
  
  ngOnInit(): void {
    this.activeTab = this.links[0].url;
    this.activeTab = this.getActiveLink(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((data: any)=>{
      this.activeTab = this.getActiveLink(data.urlAfterRedirects);
    })
    if(this.setColorTab != undefined){
      document.documentElement.style.setProperty('--color-tabs',this.setColorTab);
    }
  }
  getActiveLink(path:string)
  {
    let active = this.links[0].url;
    let link = this.links[0];

    if (this.links.length > 1) {
      for (let i = 1; i < this.links.length; i++) {
        if ( path === this.links[i].url){
          active = this.links[i].url;
          link = this.links[i];
        }
      }
    }
    
    if (link.tituloOpcional) {
      this.tituloReflejado = link;
    }
    
    return active
  }
}
