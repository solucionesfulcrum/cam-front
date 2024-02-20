import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faWaveSquare, faClock, faAngleUp, faAngleDown, faHeart, faBorderAll, faUsers, faGear} from '@fortawesome/free-solid-svg-icons';
import {CdkAccordionModule} from '@angular/cdk/accordion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, FontAwesomeModule, CdkAccordionModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  faBox = faBox;
  faWaveSquare = faWaveSquare;
  faClock = faClock;
  faAngleUp=  faAngleUp;
  faAngleDown=  faAngleDown;
  faHeart = faHeart
  faBorderAll = faBorderAll
  faUsers = faUsers
  faGear = faGear

  items = [
    {
      label: 'Item 1',
      items: [
        {
          label: 'Sub Item 1.1'
        },
        {
          label: 'Sub Item 1.2'
        }
      ]
    },
    {
      label: 'Item 2',
      items: [
        {
          label: 'Sub Item 2.1'
        },
      ]
    },
    {
      label: 'Item 3',
      items: [
        {
          label: 'Sub Item 3.1'
        },
        {
          label: 'Sub Item 3.2'
        },
        {
          label: 'Sub Item 3.3'
        },
      ]
    }
  ];


  constructor(
    private router: Router
  ) {

  }
  irCompUsuario(): void {
    this.router.navigate(['users/list'])
  }
}