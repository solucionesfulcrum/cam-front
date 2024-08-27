import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { ShowComponent } from './show/show.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ActiveUserModalComponent } from './active-user-modal/active-user-modal.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ShowRoleComponent } from './show-role/show-role.component';
import { AsignarRolModalComponent } from './asignar-rol-modal/asignar-rol-modal.component';
import { DataLoadingComponent } from '@shared/components/data-loading/data-loading.component';


@NgModule({
  declarations: [
    ListComponent,
    UsersComponent,
    RolesComponent,
    ShowComponent,
    ShowRoleComponent,
    ActiveUserModalComponent,
    AsignarRolModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CdkTableModule,
    CdkMenuModule,
    DialogModule,
    MatTabsModule,
    MatPaginatorModule,
    UsersRoutingModule,
    MaterialModule,
    MatAutocompleteModule,
    DataLoadingComponent
  ],
  providers: [ DatePipe ] 
})
export class UsersModule { }