import { Component } from '@angular/core';
import { routerTransition } from './../../router.animations';
import { Observable } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Globalfunction } from '../../core/global/globalfunction';
import { PromotionsService } from '../../core/services/promotions.service';
import { Promotions } from '../../core/models/promotions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss'],
  animations: [routerTransition()]
})
export class PromotionsListComponent {

    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5,
        filter: { logic: 'and', filters: [] }
    };

    globalfunction: Globalfunction;
    editDataItem: any;
    isNew: boolean;
    public imageUrl = `${environment.file_url}${'promotion/'}`;

    constructor(private promoService: PromotionsService, private dialogService: DialogService, private notificationService: NotificationService,) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {
        const currentState = localStorage.getItem('CurrentPromotionsList');
        if (currentState != null) {
            this.gridState = JSON.parse(currentState);
        } else {
            localStorage.setItem('CurrentPromotionsList', JSON.stringify(this.gridState));
        }

        this.view = this.promoService;
        this.getPromotionList(this.gridState);
    }

    getPromotionList(gridState){
        this.promoService.getPromotionsList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentUserList', JSON.stringify(this.gridState));
        this.getPromotionList(this.gridState);
    }

    /* public onChangeRole(stateID: any): void {
        const stateIndex = this.gridState.filter.filters.findIndex(s => s['field'] == 'title');
        if(stateID == 'All ...')
            stateID = null;
        if (stateID != null) {
            const searchState = { field: 'role', operator: 'contains', value: stateID };
            if (stateIndex < 0) { // not found
                this.gridState.filter.filters.push(searchState);
            } else {
                const state = this.gridState.filter.filters[stateIndex];
                state['value'] = stateID;
            }
        } else {
            if (stateIndex >= 0) {
                this.gridState.filter.filters.splice(stateIndex, 1);
            }
        }
        localStorage.setItem('CurrentUserList', JSON.stringify(this.gridState));
        this.getPromotionList(this.gridState);
    } */

    public addHandler(): void {
        this.editDataItem = new Promotions();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }
    
    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(promo: Promotions): void {
        const successmsg = this.isNew ? 'Add new ads successful.' : 'Update ads successful';
        const unsuccessmsg = this.isNew ? 'Add new ads unsuccessful' : 'Update ads unsuccessful';
        if (this.isNew) {
            this.promoService.savePromotions(promo).subscribe((x) => {
                if (x.data) {
                    this.getPromotionList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.promoService.updatePromotions(promo).subscribe((x) => {
                if (x.data) {
                    this.getPromotionList(this.gridState);
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
        this.promoService.removePromotions(dataItem).subscribe((x) => {
            if (x.data) {
                this.getPromotionList(this.gridState);
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
            content: 'Are you sure you want to delete ' + dataItem.title + '?',
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
