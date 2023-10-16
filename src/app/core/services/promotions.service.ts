import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject, map } from "rxjs";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class PromotionsService extends BehaviorSubject<GridDataResult> {

    gridLoading: boolean;
    constructor(private apiService: ApiService, private http: HttpClient) {
        super(null);
    }

    getPromotionsList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('promotion/promotionsList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    savePromotions(objInfo: any) {
        return this.apiService.postJson('promotion/savePromotions', objInfo);
    }

    updatePromotions(objInfo: any) {
        return this.apiService.postJson('promotion/updatePromotions', objInfo);
    }

    removePromotions(objInfo: any) {
        return this.apiService.postJson('promotion/removePromotions', objInfo);
    }
}
