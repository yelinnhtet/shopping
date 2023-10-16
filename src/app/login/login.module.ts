import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { SharedModule } from '../shared';

@NgModule({
    imports: [CommonModule, TranslateModule, LoginRoutingModule, FormsModule, ReactiveFormsModule, SharedModule],
    declarations: [LoginComponent],
    providers: [UserService]
})
export class LoginModule {}
