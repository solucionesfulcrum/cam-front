import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectGuard } from '@guards/redirect.guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate:[RedirectGuard],
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate:[AuthGuard],
    loadChildren: () =>
      import('./pages/pages.routing').then((c) => c.pagesRoutes),
  },
  // {
  //   path: AppRoute.AUTH,
  //   loadChildren: () =>
  //     import('./modules/auth/auth.module').then((m) => m.AuthModule),
  //   canActivate: [NoAuthGuard],
  // },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./layout/layout.module').then((m) => m.LayoutModule),
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
