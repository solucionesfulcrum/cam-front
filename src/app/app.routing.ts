import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectGuard } from '@guards/redirect.guard';
import { AppRoute } from './data/constants/app-route.constant';

export const routes: Route[] = [
   {
    path: '',
    canActivate:[RedirectGuard],
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: AppRoute.APP,
    canActivate:[AuthGuard],
    children:[
      {
        path: `${AppRoute.ADMIN}`,
        loadChildren: () =>
        import('./pages/pages.routing').then((c) => c.pagesAdminRoutes),
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.routing').then((c) => c.pagesRoutes),
      }
    ],
  },
  { 
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
