import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { ConnectionService } from '@services/connection.service';
import { ModalSinInternetComponent } from '@shared/components/modal-sin-internet/modal-sin-internet.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from './material/material.module';
import { environment } from '@environments/environment';
import { CommonModule } from '@angular/common';

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
    private dialog: MatDialog
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
  }

  private isDialogOpen(): boolean {
    return this.dialog.openDialogs.some(dialog => dialog.componentInstance instanceof ModalSinInternetComponent);
  }
}
