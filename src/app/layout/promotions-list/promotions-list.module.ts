import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsListRoutingModule } from './promotions-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from './../../shared';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PromotionsListComponent } from './promotions-list.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PromotionsService } from '../../core/services/promotions.service';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { IconsModule } from '@progress/kendo-angular-icons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';



@NgModule({
  declarations: [ PromotionsListComponent, AddPromotionComponent ],
  imports: [
    CommonModule,
    PromotionsListRoutingModule,
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
        UploadModule,
        DateInputsModule
  ],
  providers: [PromotionsService]
})
export class PromotonsListModule { }
