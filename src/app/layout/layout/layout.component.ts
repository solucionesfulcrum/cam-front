import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@shared/loader/loader.service';
import { UtilsService } from '@shared/services/util.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  title = 'CAM - CENTRO DE ADULTO MAYOR';
  showFiller = false;
  opened = false;
  private destroy$ = new Subject<void>();
  loadBarra!: Observable<boolean>;
  logeado: boolean = this.authService.isLogin();

  constructor(
    private utilSvc: UtilsService,
    private authService:  AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.utilSvc.sidenavOpen$.pipe(takeUntil(this.destroy$)).subscribe((sidenav) => {
        this.opened = true;
      });
    this.loadBarra = this.loaderService.isLoading$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
