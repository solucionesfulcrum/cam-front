import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cam } from 'src/app/core/_model/cam.model';
import { CamsService } from 'src/app/core/_service/cams.service';
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
  cam:Cam

  id ='' 

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private camsService: CamsService
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams', title:'CAMS'});
      this.breadcrumService.link3$.next({ url: '/cams/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('/cams');

  }

  ngOnInit(): void {
  }

  loadCamById(id:string){
    const tmp = this.camsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.cam = rta
      this.breadcrumService.link2$.next({ url: '/cams/show/'+this.id, title:rta.descripcion });
    })
  }

}
