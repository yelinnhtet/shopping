import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryListComponent } from './category-list.component';
import { CategoryListRoutingModule } from './category-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../../app/shared';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { UploadModule } from '@progress/kendo-angular-upload';
import { IconsModule } from '@progress/kendo-angular-icons';
import { LabelModule } from '@progress/kendo-angular-label';
import { CategoryService } from '../../core/services/category.service';



@NgModule({
    declarations: [
        CategoryListComponent,
        AddCategoryComponent
    ],
    imports: [
        CommonModule,
        CategoryListRoutingModule,
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
    providers: [CategoryService]
})
export class CategoryListModule { }
