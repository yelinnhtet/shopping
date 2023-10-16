import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListRoutingModule } from './user-list-routing.module';
import { PageHeaderModule } from './../../shared';
import { UserService } from './../../core/services/user.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { AddUserComponent } from './add-user/add-user.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import { UploadModule } from '@progress/kendo-angular-upload';



@NgModule({
  declarations: [ UserListComponent, AddUserComponent ],
  imports: [
    CommonModule,
    UserListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    GridModule,
    DropDownListModule,
    DropDownsModule,
    ButtonsModule,
    InputsModule,
    DialogModule,
    NotificationModule,
    LabelModule,
    IconsModule,
    UploadModule
  ],
  providers: [ UserService ]
})
export class UserListModule { }
