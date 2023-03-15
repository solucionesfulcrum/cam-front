import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-edit-cam',
  templateUrl: './edit-cam.component.html',
  styleUrls: ['./edit-cam.component.css']
})
export class EditCamComponent implements OnInit {

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 

  id ='' 
  name ='CAM TALARA' 

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams', title:'CAMS'});
      this.breadcrumService.link2$.next({ url: '/cams/show/'+this.id, title:this.name });
      this.breadcrumService.link3$.next({ url: '/cams/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('/cams');

  }

  ngOnInit(): void {
  }

}
