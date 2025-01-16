import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-ficha-afil',
  templateUrl: './ficha-afil.component.html',
  styleUrls: ['./ficha-afil.component.css']
})
export class FichaAfilComponent implements OnInit {

/*  displayedColumns: string[] = [
    'selecc',
    'usuario',
    'tipodoc',
    'nombres',
    'edad',
    'estcivil',
    'ipress',
    'tieneVigencia',
  ]; */

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService,
    ) {
    this.loadUsers()
   }

  ngOnInit(): void {
  }

  loadUsers(){
    // return this.authService.getUsuariosFromSSO(1,20)
    /*.subscribe((rta:any) =>{
      this.dataSource = new MatTableDataSource(rta.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })*/
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }
}

