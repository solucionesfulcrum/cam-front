import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumService } from 'src/app/shared/services/breadcrum.service';

@Component({
  selector: 'app-sub-view-usuarios-ciram',
  templateUrl: './sub-view-usuarios-ciram.component.html',
  styleUrls: ['../show-ciram.component.css']
})
export class SubViewUsuariosCiramComponent implements OnInit {

 sid ='' 
  id ='' 
  name ='VIEW ACTUALIZAME' 

constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private breadcrumService: BreadcrumService
    ) {
      this.route.parent?.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.sid= this.route.snapshot.paramMap.get('sid')!
      breadcrumService.subLink1$.next({ url: './', title:'USUARIOS'});
      breadcrumService.subLink2$.next({ url: './'+this.sid, title:this.name });
      breadcrumService.subLink3$.next({ url: '', title:'' });
      breadcrumService.subActiveTab$.next('/cams/cirams/show/'+this.id);
    });
  }

  ngOnInit(): void {
  }

}
