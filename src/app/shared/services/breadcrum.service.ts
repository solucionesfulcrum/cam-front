import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumService {

  public activeTab$ = new Subject<string>();
  public link1$ = new Subject<{url:string, title:string}>();
  public link2$ = new Subject<{url:string, title:string}>();
  public link3$ = new Subject<{url:string, title:string}>();

  public subActiveTab$ = new Subject<string>();
  public subLink1$ = new Subject<{url:string, title:string}>();
  public subLink2$ = new Subject<{url:string, title:string}>();
  public subLink3$ = new Subject<{url:string, title:string}>();

  constructor() { }
}
