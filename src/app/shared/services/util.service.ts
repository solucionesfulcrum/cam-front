import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class UtilsService {
    private sidenavOpen = new BehaviorSubject<boolean>(false);
    sidenavOpen$ = this.sidenavOpen.asObservable();

    openSidenav(value: boolean): void {
        this.sidenavOpen.next(value);
    }
}

