import { Injectable } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class CategoryService extends BehaviorSubject<GridDataResult> {
    gridLoading: boolean;
    constructor(private apiService: ApiService) {
        super(null);
    }

    getCategoryList(gridState: []) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('category/categoryList', { "gridState": gridState })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    saveCategory(objInfo: any) {
        return this.apiService.postJson('category/saveCategory', objInfo);
    }

    updateCategory(objInfo: any) {
        return this.apiService.postJson('category/updateCategory', objInfo);
    }

    removeCategory(objInfo: any) {
        return this.apiService.postJson('category/removeCategory', objInfo);
    }
}
