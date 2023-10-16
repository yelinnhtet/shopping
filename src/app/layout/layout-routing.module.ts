import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            // { path: 'charts', loadChildren: () => import('./charts/charts.module').then((m) => m.ChartsModule) },
            { path: 'shops', loadChildren: () => import('./shop-list/shop-list.module').then((m) => m.ShopListModule) },
            { path: 'orders', loadChildren: () => import('./order-list/order-list.module').then((m) => m.OrderListModule) },
            { path: 'products', loadChildren: () => import('./product-list/product-list.module').then((m) => m.ProductListModule) },
            { path: 'ads-one', loadChildren: () => import('./ads-list/ads-list.module').then((m) => m.AdsListModule) },
            { path: 'ads-two', loadChildren: () => import('./ads-list/ads-list.module').then((m) => m.AdsListModule) },
            { path: 'ads-three', loadChildren: () => import('./ads-list/ads-list.module').then((m) => m.AdsListModule) },
            { path: 'ads-four', loadChildren: () => import('./ads-list/ads-list.module').then((m) => m.AdsListModule) },
            { path: 'ads-five', loadChildren: () => import('./ads-list/ads-list.module').then((m) => m.AdsListModule) },

            { path: 'user/:UID', loadChildren: () => import('./user-list/user-list.module').then((m) => m.UserListModule) },
            { path: 'admin/:UID', loadChildren: () => import('./user-list/user-list.module').then((m) => m.UserListModule) },
            { path: 'agent/:UID', loadChildren: () => import('./user-list/user-list.module').then((m) => m.UserListModule) },
            { path: 'merchant/:UID', loadChildren: () => import('./user-list/user-list.module').then((m) => m.UserListModule) },
            { path: 'supervisor/:UID', loadChildren: () => import('./user-list/user-list.module').then((m) => m.UserListModule) },
            { path: 'currencies', loadChildren: () => import('./currency-list/currency-list.module').then((m) => m.CurrencyListModule) },
            { path: 'categories', loadChildren: () => import('./category-list/category-list.module').then((m) => m.CategoryListModule) },
            { path: 'promotions', loadChildren: () => import('./promotions-list/promotions-list.module').then((m) => m.PromotonsListModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
