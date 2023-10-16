import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject, map } from "rxjs";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class ProductService extends BehaviorSubject<GridDataResult> {

    gridLoading: boolean;
    constructor(private apiService: ApiService, private http: HttpClient) {
        super(null);
    }

    getProductList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('product/productList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    saveProduct(objInfo: any) {
        return this.apiService.postJson('product/saveProduct', objInfo);
    }

    updateProduct(objInfo: any) {
        return this.apiService.postJson('product/updateProduct', objInfo);
    }

    removeProduct(objInfo: any) {
        return this.apiService.postJson('product/removeProduct', objInfo);
    }

    getShop(){
        return this.apiService.get('shop/getShop');
    }

    getCategory(){
        return this.apiService.get('category/getCategories');
    }

    getCurrency(){
        return this.apiService.get('getCurrencies');
    }

    getGoodSpec(){
        return this.apiService.get('product/getGoodSpec');
    }
}
