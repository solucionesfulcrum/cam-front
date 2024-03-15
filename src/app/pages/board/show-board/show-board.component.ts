import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToDo, Column } from 'src/app/models/todo.model';
import {Dialog, DialogModule} from '@angular/cdk/dialog';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';



@Component({
  selector: 'app-show-board',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, DragDropModule, DialogModule ],
  templateUrl: './show-board.component.html',
  styles: [
    `
    /* Animate items as they're being sorted. */
    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    /* Animate an item that has been dropped. */
    .cdk-drag-animating {
      transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
    }
    `
  ] 
})

export class ShowBoardComponent implements OnInit {

  columns: Column[] = [
    {
      title: 'ToDo',
      todos: [
        {
          id: '1',
          title: 'Make dishes'
        },
        {
          id: '2',
          title: 'Buy a unicorn'
        }
      ]
    },
    {
      title: 'Doing',
      todos: [
        {
          id: '3',
          title: 'Watch Angular Path '
        }
      ]
    },
    {
      title: 'Done',
      todos: [
        {
          id: '4',
          title: 'Play video games'
        }
      ]
    }
  ];

  todos: ToDo[] = [];
  doing: ToDo[] = [];
  done: ToDo[] = [];

  constructor(private dialog : Dialog ) { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<ToDo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

  }

    addColumn() {
    this.columns.push({
      title: 'New Column',
      todos: [],
    });
  }

  openDialog( todo: ToDo){
    const dialogRef = this.dialog.open(ModalComponent,{
      minWidth:'300px',
      maxWidth:'50%',
      autoFocus:false,
      data:{
        todo:todo
      }
    })
    dialogRef.closed.subscribe(out =>{
      console.log(out)
    })
  }

}
