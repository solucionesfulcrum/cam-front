import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { CerpUserGuard } from '@guards/cerp-user.guard';
import { AdminUserGuard } from '@guards/admin-user.guard';
import { ToolbarAdminComponent } from '../layout/toolbar-admin/toolbar-admin.component';
import { AppRoute } from '../data/constants/app-route.constant';
import { SelectUnidOperativaComponent } from './administracion-usuario/select-unid-operativa/select-unid-operativa.component';
import { EditActiveUserComponent } from './administracion-usuario/edit-active-user/edit-active-user.component';
import { AfiliadosLayoutComponent } from './afiliados/afiliados-layout.component';
import { GuardCoordinadorGuard } from '@guards/guard-coordinador.guard';

export const pagesRoutes: Route[] = [
  {
    path: '',
    canActivate:[AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard', //admission
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate:[AuthGuard, CerpUserGuard],
        title:'Mi tablero',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((c) => c.DashboardModule),
      },
      {
        path: 'adm-uo',
        canActivate:[AuthGuard, CerpUserGuard],
        title:'Mi Administración UO',
        loadChildren: () =>
          import('./adm-uo/adm-uo.module').then((c) => c.AdmUoModule),
      },
      {
        path: 'home',
        canActivate:[AuthGuard],
        title:'Mi home',
        loadChildren: () =>
          import('./home/home.routing').then((c) => c.homeRoutes),
      },
      {
        path: 'profile',
        canActivate:[AuthGuard],
        loadChildren: () =>
          import('./profile/profile.routing').then((c) => c.profileRoutes),
      },
      // {
      //   path: AppRoute.USUARIOS,
      //   canActivate:[AuthGuard, AdminUserGuard],
      //   title:'Lista de usuarios',
      //   loadChildren: () =>
      //     import('./users/users.module').then((m) => m.UsersModule),
      // },
      {
        path: AppRoute.CONTRATOS,
        title: 'CAM - CONTRATOS',
        canActivate: [AuthGuard, GuardCoordinadorGuard],
        loadChildren: () => import('../pages/contratos/contratos.module').then((m) => m.ContratosModule),
      },
      {
        path: 'contactos',
        title: 'CAM - CONTACTOS',
        canActivate: [AuthGuard],
        loadChildren: () => import('../pages/contactos/contactos.module').then((m) => m.ContactosModule),
      },
      {
        path: 'afiliados',
        title: 'CAM - AFILIADOS',
        canActivate: [AuthGuard],
        loadChildren: () => import('../pages/afiliados/afiliados.module').then((m) => m.AfiliadosModule),
      },
      {
        path: AppRoute.PROGRAMACION,
        title: 'CAM - PROGRAMACION',
        canActivate: [AuthGuard],
        loadChildren: () => import('../pages/programacion/programacion.module').then((m) => m.ProgramacionModule),
      },
      {
        path: AppRoute.HORARIOS,
        canActivate:[AuthGuard, CerpUserGuard],
        title:'Horarios',
        loadChildren: () =>
          import('./horario/horario.module').then((m) => m.HorarioModule),
      },
      {
        path: AppRoute.ATENCIONES,
        canActivate:[AuthGuard, CerpUserGuard],
        title:'Atenciones',
        loadChildren: () =>
          import('./atencion/atencion.module').then((m) => m.AtencionModule),
      },
      {
        path:'**',
        redirectTo:'home'
      },
    ],
  },
];

export const pagesAdminRoutes: Route[] = [
  {
    path: '',
    canActivate:[AuthGuard],
    component: ToolbarAdminComponent,
    children:[
      {
        path: AppRoute.USUARIOS,
        canActivate:[AuthGuard],
        title:'Lista de usuarios',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: '',
        title: 'Elija la Unidad Operativa',
        component: SelectUnidOperativaComponent
      },
      {
        path: AppRoute.EDIT_USER,
        title: 'Editar Usuario',
        component: EditActiveUserComponent,
      }
    ]
  },
];