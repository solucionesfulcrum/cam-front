import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth-service.service';
import { UtilsService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isLogged = false;
  @Output() toggleSidenav = new EventEmitter();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private utilSvc: UtilsService
  ) {}

  ngOnInit(): void {
    this.authSvc.isLogged
      .pipe(takeUntil(this.destroy$))
      .subscribe((logueado) => {
        this.isLogged = logueado;
      });
  }

  onLogout(): void {
    // this.router.navigate(['/']);
    this.utilSvc.openSidenav(false);
    this.authSvc.logout();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
