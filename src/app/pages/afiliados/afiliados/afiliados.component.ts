import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.css']
})
export class AfiliadosComponent implements OnInit  {

  optEstados: any[] = [
    {nombre:'Disponibles', valor1:'01'},
    {nombre:'Suspendidos', valor1:'02'},
    {nombre:'No Disponibles', valor1:'03'}
  ];

  form= this.fb.group({
    fechaIni: [''],
    fechaFin: [''],
  });

  displayedColumns: string[] = [
    'selecc',
    'usuario',
    'tipodoc',
    'nombres',
    'edad',
    'estcivil',
    'ipress',
    'tieneVigencia',
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


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
    // .subscribe((rta:any) =>{
    //   this.dataSource = new MatTableDataSource(rta.list);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
    
  }

  filtrarFechas(): void {}

  filtrarTabla(event: any): void {}

  setLink2(nameLink: string, codigo:string){
      this.router.navigate(['/afiliados/show/', codigo]);
  }

  getClassRow(i:number) :string {
    let row =""
    if ( i%2!=0)
     row ="rowColor" 
    return row
  }

 applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Se agrega esta funcion para opcion de seleccion TODOS
  selectAll = false;   //dataSource: MatTableDataSource<any>; 
  toggleSelectAll() {
    const data = this.dataSource.data;
    for (const element of data) {
      element.isSelected = this.selectAll;
    }
  }

  Nuevo() {
    this.router.navigate(['/afiliados/show/:id/activaciones'])
  }
 
}



