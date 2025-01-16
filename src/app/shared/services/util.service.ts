import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UtilService {
  private sidenavOpen = new BehaviorSubject<boolean>(false);
  sidenavOpen$ = this.sidenavOpen.asObservable();

  constructor() { }

  openSidenav(value: boolean): void {
    this.sidenavOpen.next(value);
  }
}
