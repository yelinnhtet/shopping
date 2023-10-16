import { Component } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { routerTransition } from '../../router.animations';
import { Globalfunction } from '../../core/global/globalfunction';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { environment } from '../../../environments/environment';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Category } from '../../core/models/category.model';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
    animations: [routerTransition()]
})
export class CategoryListComponent {

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
    imageUrl = `${environment.file_url}${'category/'}`;

    constructor(private categoryService: CategoryService, private dialogService: DialogService, private notificationService: NotificationService,) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    ngOnInit(): void {
        const currentState = localStorage.getItem('CurrentCategoryList');
        if (currentState != null) {
            this.gridState = JSON.parse(currentState);
        } else {
            localStorage.setItem('CurrentCategoryList', JSON.stringify(this.gridState));
        }

        this.view = this.categoryService;
        this.getCategoryList(this.gridState);
    }

    getCategoryList(gridState: any) {
        this.categoryService.getCategoryList(gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentCategoryList', JSON.stringify(this.gridState));
        this.getCategoryList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new Category();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(category: Category): void {
        const successmsg = this.isNew ? 'Add new category successful.' : 'Update category successful';
        const unsuccessmsg = this.isNew ? 'Add new category unsuccessful' : 'Update category unsuccessful';
        if (this.isNew) {
            this.categoryService.saveCategory(category).subscribe((x) => {
                if (x.data) {
                    this.getCategoryList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.categoryService.updateCategory(category).subscribe((x) => {
                if (x.data) {
                    this.getCategoryList(this.gridState);
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
        this.categoryService.removeCategory(dataItem).subscribe((x) => {
            if (x.data) {
                this.getCategoryList(this.gridState);
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
