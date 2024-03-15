import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { faClose , faCheckToSlot, faTag, faCheckSquare, faClock, faBars, faUser} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../btn/button.component';
import { ToDo } from 'src/app/models/todo.model';

interface inputData{
  todo: ToDo
}

interface outputData{
  rta: boolean 
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ButtonComponent ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  faClose= faClose
  faCheckToSlot = faCheckToSlot 
  faTag = faTag 
  faCheckSquare = faCheckSquare
  faClock = faClock
  faBars = faBars
  faUser = faUser

  todo! : ToDo
  constructor(
    private dialogRef: DialogRef<outputData>,
    @Inject(DIALOG_DATA) private data:inputData 
    ){
      this.todo = data.todo
  }

  close(){
    this.dialogRef.close()
  }

  closeWithRta(rta:boolean){
    this.dialogRef.close({
      rta:rta
    })
  }
}
