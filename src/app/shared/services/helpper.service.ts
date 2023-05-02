import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cam } from 'src/app/core/_model/cam.model';
import { Ciram } from 'src/app/core/_model/ciram.model';
import { Programa } from 'src/app/core/_model/programa.model';

@Injectable({
  providedIn: 'root'
})
export class HelpperService {

  public uo$ = new Subject<any>();
  public list_uo$ = new Subject< any[] >();
  public show_list$ = new Subject< boolean >();

  constructor() { }
}