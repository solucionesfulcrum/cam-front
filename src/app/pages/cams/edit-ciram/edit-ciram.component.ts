import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { CiramsService } from 'src/app/core/_service/cirams.service';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-edit-ciram',
  templateUrl: './edit-ciram.component.html',
  styleUrls: ['./edit-ciram.component.css']
})
export class EditCiramComponent implements OnInit {

  subBreadcrum1:{url:string, title:string }
  subBreadcrum2:{url:string, title:string } 
  subBreadcrum3:{url:string, title:string } 
  ciram:Ciram

  id ='' 

 constructor(
  private router: Router, 
  private fb: FormBuilder, 
  private route: ActivatedRoute,
  private breadcrumService: BreadcrumService,
  private ciramsService: CiramsService
    ) {
      this.id = this.route.snapshot.paramMap.get('id')! 

      //for breadcrum
      this.breadcrumService.link1$.next({url:'/cams/cirams', title:'CIRAMS'});
      this.breadcrumService.link3$.next({ url: '/cams/cirams/edit/'+this.id, title:'EDITAR'});
      this.breadcrumService.activeTab$.next('cirams');
  }

  ngOnInit(): void {
  }

  loadCiramById(id:string){
    const tmp = this.ciramsService.listarPorId(parseInt(this.id))
    .subscribe((rta:any) =>{
      this.ciram = rta
      this.breadcrumService.link2$.next({ url: '/cams/cirams/show/'+this.id, title:rta.descripcion });
    })
  }

}