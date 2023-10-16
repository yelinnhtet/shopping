import { Component } from '@angular/core';
import { routerTransition } from './../../router.animations';
import { Globalfunction } from '../../core/global/globalfunction';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ProductService } from '../../core/services/product.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    animations: [routerTransition()]
})
export class ProductListComponent {
    // dat: any = 1;
    // productList: any[] = [];
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5,
        filter: { logic: 'and', filters: [] }
    };

    public globalfunction: Globalfunction;
    public editDataItem: Product;
    public isNew: boolean;
    constructor(private route: ActivatedRoute, private productService: ProductService, private dialogService: DialogService, private notificationService: NotificationService) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {

        this.view = this.productService;
        this.getProductList(this.gridState);
    }

    public getProductList(gridState) {
        this.productService.getProductList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentProductList', JSON.stringify(this.gridState));
        this.getProductList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new Product();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(product: Product): void {
        const successmsg = this.isNew ? 'Add new product successful.' : 'Update product successful';
        const unsuccessmsg = this.isNew ? 'Add new product unsuccessful' : 'Update product unsuccessful';
        if (this.isNew) {
            this.productService.saveProduct(product).subscribe((x) => {
                if (x.data) {
                    this.getProductList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.productService.updateProduct(product).subscribe((x) => {
                if (x.data) {
                    this.getProductList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        }

        this.editDataItem = undefined;
    }

    public removeHandler(dataItem): void {
        this.productService.removeProduct(dataItem).subscribe((x) => {
            if (x.data > 0) {
                this.getProductList(this.gridState);
                this.showSuccess('Remove item successful.');
            }
            else
                this.showError('Remove item unsuccessful.');
        });
    }

    public deleteItem() {
        this.removeHandler(this.DialogItem);
        this.close();
    }

    private DialogItem;
    private dialog;
    public showDeleteConfirmation(actionTemplate, dataItem) {
        this.DialogItem = dataItem;
        this.dialog = this.dialogService.open({
            title: 'Comfirm',
            content: 'Are you sure you want to delete ' + dataItem.name + '?',
            actions: actionTemplate,
            width: 450,
            height: 200,
            minWidth: 250
        });
    }

    public close() {
        if (this.dialog) {
            this.dialog.close();
        }
    }

    public showSuccess(showmsg): void {
        this.notificationService.show({
            content: showmsg,
            hideAfter: 1200,
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'success', icon: true }
        });
    }

    public showError(showmsg): void {
        this.notificationService.show({
            content: showmsg,
            hideAfter: 1200,
            position: { horizontal: 'right', vertical: 'bottom' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'error', icon: true }
        });
    }
}
