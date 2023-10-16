import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class ShopService extends BehaviorSubject<GridDataResult> {
    gridLoading: boolean;
    constructor(private apiService: ApiService) {
        super(null);
    }

    getShopList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('shop/shopList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    getCountryCode() {
        return this.apiService.get('country/countryCode');
    }

    saveShop(objInfo: any) {
        return this.apiService.postJson('shop/saveShop', objInfo);
    }

    updateShop(objInfo: any) {
        return this.apiService.postJson('shop/updateShop', objInfo);
    }

    remove(objInfo: any) {
        return this.apiService.postJson('shop/remove', objInfo);
    }

    getCountry() {
        return this.apiService.get('country');
    }
    getStateByCountryID(country_id) {
        return this.apiService.postJson('state/getStateByID', { 'country_id': country_id});
    }
    getCityByStateID(state_id) {
        return this.apiService.postJson('city/getCityByID', {'state_id': state_id});
    }
}
