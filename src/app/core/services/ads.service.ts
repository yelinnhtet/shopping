import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class AdsService extends BehaviorSubject<GridDataResult> {
    gridLoading: boolean;
    constructor(private apiService: ApiService) {
        super(null);
    }

    getAdsList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('ads/adsList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    saveAds(objInfo: any) {
        return this.apiService.postJson('ads/saveAds', objInfo);
    }

    updateAds(objInfo: any) {
        return this.apiService.postJson('ads/updateAds', objInfo);
    }

    remove(objInfo: any) {
        return this.apiService.postJson('ads/remove', objInfo);
    }
}
