import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  /*
  {
    path: '',
    component:  ProfileComponent,
  },
  */
 {
    path: '',
    title: 'Mi perfilito',
    loadComponent: () =>
      import('./profile.component').then((c) => c.ProfileComponent),
  },
];