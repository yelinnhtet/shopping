import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { CoreModule } from './core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from './shared/shared.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';



@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        CoreModule,
        GridModule,
        SharedModule,
        DateInputsModule
    ],
    exports: [AppComponent],
    declarations: [AppComponent],
    providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy }, AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
