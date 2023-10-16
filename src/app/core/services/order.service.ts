import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class OrderService extends BehaviorSubject<GridDataResult> {
    gridLoading: boolean;
    constructor(private apiService: ApiService) {
        super(null);
    }

    getOrderList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('order/orderList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    getCountryCode() {
        return this.apiService.get('country/countryCode');
    }

    saveOrder(objInfo: any) {
        return this.apiService.postJson('order/register', objInfo);
    }

    updateOrder(objInfo: any) {
        return this.apiService.postJson('order/updateOrder', objInfo);
    }

    remove(objInfo: any) {
        return this.apiService.postJson('order/remove', objInfo);
    }
}
