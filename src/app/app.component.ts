import { Component} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { ConnectionService } from '@services/connection.service';
import { ModalSinInternetComponent } from '@shared/components/modal-sin-internet/modal-sin-internet.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from './material/material.module';
import { environment } from '@environments/environment';
import { CommonModule } from '@angular/common';
import { BroadcastService } from './data/services/gestion-app/broadcast-service.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule,  HttpClientModule, MaterialModule, CommonModule],
  providers: [
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  environment = environment;
  constructor(
    private connectionService: ConnectionService, 
    private dialog: MatDialog,
    private broadcastService: BroadcastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.connectionService.connectionStatus$.subscribe(isConnected => {
      if (!isConnected && !this.isDialogOpen()) {
        this.dialog.open(ModalSinInternetComponent, {
          width: '500px',
          data: { message: 'No internet connection. Please check your network settings.' }
        });
      }
    });

    this.broadcastService.onSessionUpdate().subscribe(() => {
      this.updateComponents();
    });
  }

  updateComponents() {
    this.router.navigate(['/app/admin']);
    location.reload();
  }

  private isDialogOpen(): boolean {
    return this.dialog.openDialogs.some(dialog => dialog.componentInstance instanceof ModalSinInternetComponent);
  }
}
