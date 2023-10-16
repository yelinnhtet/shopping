import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../shared';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ProductService } from '../../core/services/product.service';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({
  declarations: [ProductListComponent, AddProductComponent],
  imports: [
    CommonModule,
    ProductListRoutingModule,
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
  providers: [ProductService]
})
export class ProductListModule { }
