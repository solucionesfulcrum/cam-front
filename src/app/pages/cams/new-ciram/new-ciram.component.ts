import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-new-ciram',
  templateUrl: './new-ciram.component.html',
  styleUrls: ['./new-ciram.component.css']
})
export class NewCiramComponent implements OnInit {

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService
    ) {

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/cirams', title:'CIRAMS'});
      this.breadcrumService.link2$.next({ url: '/cams/cirams/new', title:'NUEVO CIRAM'});
      this.breadcrumService.link3$.next({ url: '', title:''});
      this.breadcrumService.activeTab$.next('/cirams');
  }

  ngOnInit(): void {
  }

}
