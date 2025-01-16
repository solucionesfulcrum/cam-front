import { Route } from '@angular/router';
import { BoardComponent } from './board.component';
import { ShowBoardComponent } from './show-board/show-board.component';

export const boardsRoutes: Route[] = [
  {
    path: '',
    component:  BoardComponent,
  },
  {
    path: ':id',
    component: ShowBoardComponent,
  },
];