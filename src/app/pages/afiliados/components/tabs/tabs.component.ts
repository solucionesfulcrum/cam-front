import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent  {
  @ViewChild('tab1Content') tab1Content!: TemplateRef<any>;
  @ViewChild('tab2Content') tab2Content!: TemplateRef<any>;
  tabs: Tab[] = [
  //  { title: 'Operaciones', content: 'Contenido de la pestaña 1' },
  //  { title: 'Evaluaciones', content: 'Contenido de la pestaña 2' },
  ];

  selectedTab: Tab | undefined;
  
  @Input()
  links=[{url:'', title: ''}];

  @Input()
  setColorTab!: string;

  activeTab!: string;
  
  constructor(private route: ActivatedRoute,       
              private router: Router) {
    this.tabs = [
      { title: 'Operaciones', content: this.tab1Content },
      { title: 'Evaluaciones', content: this.tab2Content },
      // Otras pestañas aquí
    ];
            
  }
    
  selectTab(tab?: Tab): void {
     this.selectedTab = tab;
    
   }

  ngOnInit(): void {
    this.selectedTab = this.tabs[0]; // Establece la pestaña 1 como activa al cargar el componente

    this.activeTab = this.links[0].url;
    //this.activeTab = this.getActiveLink(this.router.url);

    if(this.setColorTab != undefined){
      document.documentElement.style.setProperty('--color-tabs',this.setColorTab);
    }
  }

  // getActiveLink(path:string)
  // {
  //   let active = this.links[0].url;

  //   if (this.links.length > 1) {
  //     for (let i = 1; i < this.links.length; i++) {
  //       if ( path === this.links[i].url){
  //         active = this.links[i].url
  //       }
  //     }
  //   }
    
  //   return active
  // }

  Descarga(){

  }
}

interface Tab {
  title: string;
  content: TemplateRef<any>;
}
