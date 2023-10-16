import { Component } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Globalfunction } from '../../core/global/globalfunction';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { environment } from '../../../environments/environment';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Currency } from '../../core/models/currency.model';
import { CurrencyService } from '../../core/services/currency.service';

@Component({
    selector: 'app-currency-list',
    templateUrl: './currency-list.component.html',
    styleUrls: ['./currency-list.component.scss'],
    animations: [routerTransition()]
})
export class CurrencyListComponent {

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
    imageUrl = `${environment.file_url}${'currency/'}`;

    constructor(private currencyService: CurrencyService, private dialogService: DialogService, private notificationService: NotificationService,) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {
        const currentState = localStorage.getItem('CurrentCurrencyList');
        if (currentState != null) {
            this.gridState = JSON.parse(currentState);
        } else {
            localStorage.setItem('CurrentCurrencyList', JSON.stringify(this.gridState));
        }

        this.view = this.currencyService;
        this.getCurrencyList(this.gridState);
    }

    getCurrencyList(gridState: any) {
        this.currencyService.getCurrencyList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentCurrencyList', JSON.stringify(this.gridState));
        this.getCurrencyList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new Currency();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(currency: Currency): void {
        const successmsg = this.isNew ? 'Add new currency successful.' : 'Update currency successful';
        const unsuccessmsg = this.isNew ? 'Add new currency unsuccessful' : 'Update currency unsuccessful';
        if (this.isNew) {
            this.currencyService.saveCurrency(currency).subscribe((x) => {
                if (x.data) {
                    this.getCurrencyList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.currencyService.updateCurrency(currency).subscribe((x) => {
                if (x.data) {
                    this.getCurrencyList(this.gridState);
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
        this.currencyService.removeCurrency(dataItem).subscribe((x) => {
            if (x.data) {
                this.getCurrencyList(this.gridState);
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
            content: 'Are you sure you want to delete ' + dataItem.currency_name + '?',
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
