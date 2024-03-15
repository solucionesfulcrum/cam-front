import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule,  HttpClientModule],
  providers: [
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

}
