import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'esp-edit-active-user',
  templateUrl: './edit-active-user.component.html',
  styleUrls: ['./edit-active-user.component.scss'],
  standalone: true,
  imports:[CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class EditActiveUserComponent {

}
