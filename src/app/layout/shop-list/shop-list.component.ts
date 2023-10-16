import { Component } from '@angular/core';
import { routerTransition } from './../../router.animations';
import { Globalfunction } from '../../core/global/globalfunction';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ShopService } from '../../core/services/shop.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ActivatedRoute } from '@angular/router';
import { Shop } from '../../core/models/shop.model';

@Component({
    selector: 'app-shop-list',
    templateUrl: './shop-list.component.html',
    styleUrls: ['./shop-list.component.scss'],
    animations: [routerTransition()]
})
export class ShopListComponent {

    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5,
        filter: { logic: 'and', filters: [] }
    };

    public globalfunction: Globalfunction;
    public editDataItem: Shop;
    public isNew: boolean;
    constructor(private route: ActivatedRoute, private shopService: ShopService, private dialogService: DialogService, private notificationService: NotificationService) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {
        this.view = this.shopService;

        this.getShopList(this.gridState);
    }

    public getShopList(gridState) {
        this.shopService.getShopList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentShopList', JSON.stringify(this.gridState));
        this.getShopList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new Shop();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(shop: Shop): void {
        const successmsg = this.isNew ? 'Add new shop successful.' : 'Update shop successful';
        const unsuccessmsg = this.isNew ? 'Add new shop unsuccessful' : 'Update shop unsuccessful';
        if (this.isNew) {
            this.shopService.saveShop(shop).subscribe((x) => {
                if (x.data) {
                    this.getShopList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.shopService.updateShop(shop).subscribe((x) => {
                if (x.data) {
                    this.getShopList(this.gridState);
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
        this.shopService.remove(dataItem).subscribe((x) => {
            if (x.data > 0) {
                this.getShopList(this.gridState);
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
