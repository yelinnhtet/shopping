import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsListComponent } from './promotions-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '',
    component: PromotionsListComponent
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PromotionsListRoutingModule { }
