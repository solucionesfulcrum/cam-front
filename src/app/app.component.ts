import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilsService } from './shared/services/util.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LoaderService } from './shared/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CAM - CENTRO DE ADULTO MAYOR';
  showFiller = false;
  opened = false;
  private destroy$ = new Subject<void>();
  loadBarra!: Observable<boolean>;

  constructor(
    private utilSvc: UtilsService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.utilSvc.sidenavOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sidenav) => {
        this.opened = sidenav;
      });
    this.loadBarra = this.loaderService.isLoading$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
