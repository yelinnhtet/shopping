import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyListComponent } from './currency-list.component';

const routes: Routes = [
    {
      path: '',
      component: CurrencyListComponent
    }
  ]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CurrencyListRoutingModule { }
