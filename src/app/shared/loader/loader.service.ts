import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public percent: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  get percent$(): Observable<number> {
    return this.percent.asObservable();
  }

  constructor() {}
}
