import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../users/users.component';
import { RolService } from '@services/rol.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {

  dataRoles: any[] = [];
  columns: string[] = ['id','nombreRol', 'registro', 'status'];
  pageSizeOptions:number[] = [5,10,20];
  pageIndex = 0;
  

  constructor(private rolesService              : RolService){

  }

  ngOnInit(): void {
    
    this.rolesService.getListRoles().subscribe((data)=>{
      this.dataRoles = data.data;
      this.dataRoles.sort((a, b) => new Date(b.fechReg).getTime() - new Date(a.fechReg).getTime());
    })
  }
}
