import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { FormatoTab } from '../menu-opciones/formato-tab.model';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'esp-menu-opciones-v2',
  templateUrl: './menu-opciones-v2.component.html',
  standalone: true,
  imports:[CommonModule, MatTabsModule, RouterModule],
  styleUrls: ['./menu-opciones-v2.component.scss']
})
export class MenuOpcionesV2Component {

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
        if (path.includes(this.links[i].url)){
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


  setClickDinamic(url: string, tituloReflejado: FormatoTab, disabled?: boolean){
    if(!disabled) {
      this.activeTab = url; 
      this.tituloReflejado = tituloReflejado
    }
  }

  setEnabledLabel(url: string, disabled?: boolean) : boolean{
    let enabled : boolean= false;
    if(!disabled) {
      enabled = true; 
    }
    else if(disabled && url == this.activeTab){
      enabled = true; 
    }
    else{
      enabled = false;
    }
    return enabled;
  }

  getRouterLink(url: string, disabled?: boolean) : any{
    let urlRouter : any= null;
    if(!disabled) {
      urlRouter = url; 
    }
    else if(disabled && url == this.activeTab){
      urlRouter = url; 
      ////console.log(urlRouter);
    }
    else{
      urlRouter = null;
    }
    return urlRouter;
  }
}
