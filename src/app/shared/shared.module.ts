import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TimePickerModule, DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule , DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule } from '@progress/kendo-angular-label';
import { PopupModule } from '@progress/kendo-angular-popup';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { UploadModule } from '@progress/kendo-angular-upload';


@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    TimePickerModule,
    DatePickerModule,
    DateInputsModule,
    DialogModule,
    InputsModule,
    ButtonsModule,
    NgbAlertModule,
    GridModule,
    DropDownsModule,
    IntlModule,
    LabelModule,
    PopupModule,
    DropDownListModule,
    NotificationModule,
    UploadModule
  ],
  exports: [
    NgbModule,
  	NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DialogModule,
    InputsModule,
    ButtonsModule,
    NgbAlertModule,
    LayoutModule,
    TimePickerModule,
    DatePickerModule,
    DateInputsModule,
    DropDownsModule,
    IntlModule,
    LabelModule,
    PopupModule,
    DropDownListModule,
    NotificationModule,
    UploadModule
  ],
  declarations: []
})
export class SharedModule { }
