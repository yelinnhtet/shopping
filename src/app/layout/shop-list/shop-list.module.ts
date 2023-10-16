import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopListRoutingModule } from './shop-list-routing.module';
import { ShopListComponent } from './shop-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from './../../shared';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ShopService } from '../../core/services/shop.service';
import { AddShopComponent } from './add-shop/add-shop.component';


@NgModule({
  declarations: [ShopListComponent, AddShopComponent],
  imports: [
    CommonModule,
    ShopListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgbDropdownModule,
    PageHeaderModule,
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
  providers: [ShopService]
})
export class ShopListModule { }
