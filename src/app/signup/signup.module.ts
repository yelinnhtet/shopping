import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../core/services/user.service';

@NgModule({
    imports: [CommonModule, TranslateModule, SignupRoutingModule, FormsModule, ReactiveFormsModule],
    declarations: [SignupComponent],
    providers: [UserService]
})
export class SignupModule {}
