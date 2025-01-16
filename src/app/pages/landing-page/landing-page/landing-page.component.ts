import { Component } from '@angular/core';

@Component({
  selector: 'esp-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  userSesion = JSON.parse(localStorage.getItem("camUser")!)

  ngOnInit(){
  }
}
