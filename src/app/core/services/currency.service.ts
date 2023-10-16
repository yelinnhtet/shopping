import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class CurrencyService extends BehaviorSubject<GridDataResult> {
    gridLoading: boolean;
    constructor(private apiService: ApiService) {
        super(null);
    }

    getCurrencyList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('currency/currencyList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    saveCurrency(objInfo: any) {
        return this.apiService.postJson('currency/saveCurrency', objInfo);
    }

    updateCurrency(objInfo: any) {
        return this.apiService.postJson('currency/updateCurrency', objInfo);
    }

    removeCurrency(objInfo: any) {
        return this.apiService.postJson('currency/removeCurrency', objInfo);
    }
}
