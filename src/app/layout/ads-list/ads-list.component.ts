import { Component } from '@angular/core';
import { routerTransition } from './../../router.animations';
import { Globalfunction } from '../../core/global/globalfunction';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { AdsService } from '../../core/services/ads.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ActivatedRoute } from '@angular/router';
import { Ads } from '../../core/models/ads.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-ads-list',
    templateUrl: './ads-list.component.html',
    styleUrls: ['./ads-list.component.scss'],
    animations: [routerTransition()]
})
export class AdsListComponent {

    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5,
        filter: { logic: 'and', filters: [] }
    };

    public imageUrl = `${environment.file_url}${'ads/'}`;

    public globalfunction: Globalfunction;
    public editDataItem: Ads;
    public isNew: boolean;
    constructor(private route: ActivatedRoute, private adsService: AdsService, private dialogService: DialogService, private notificationService: NotificationService) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {
        this.view = this.adsService;
        this.getAdsList(this.gridState);
    }

    public getAdsList(gridState) {
        this.adsService.getAdsList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentAdsList', JSON.stringify(this.gridState));
        this.getAdsList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new Ads();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(ads: Ads): void {
        const successmsg = this.isNew ? 'Add new ads successful.' : 'Update ads successful';
        const unsuccessmsg = this.isNew ? 'Add new ads unsuccessful' : 'Update ads unsuccessful';
        if (this.isNew) {
            this.adsService.saveAds(ads).subscribe((x) => {
                if (x.data) {
                    this.getAdsList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.adsService.updateAds(ads).subscribe((x) => {
                if (x.data) {
                    this.getAdsList(this.gridState);
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
        this.adsService.remove(dataItem).subscribe((x) => {
            if (x.data) {
                this.getAdsList(this.gridState);
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
