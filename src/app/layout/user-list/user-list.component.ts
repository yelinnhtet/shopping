import { Component, OnInit } from '@angular/core';
import { UserService } from './../../core/services/user.service';
import { routerTransition } from './../../router.animations';
import { Observable } from 'rxjs';
import { AddEvent, GridDataResult, RemoveEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { User } from './../../core/models/user.model';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Globalfunction } from './../../core/global/globalfunction';
import { ActivatedRoute } from '@angular/router';
import uniqueRandom from 'unique-random';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    animations: [routerTransition()]
})
export class UserListComponent implements OnInit {

    public userStatus: any = [{ status: 'on' }, { status: 'off' }];
    public userRole: any = [{ role: 'user' }, { role: 'Admin' }, { role: 'Agent' }, { role: 'Supervisor' }, { role: 'Merchant' }];
    public message: string;
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5,
        filter: { logic: 'and', filters: [] }
    };

    public globalfunction: Globalfunction;
    public editDataItem: User;
    public isNew: boolean;
    public userListData: any;
    status: null;
    public u_id = parseInt(this.route.snapshot.paramMap.get('UID'));
    header: string;

    constructor(private route: ActivatedRoute, private userService: UserService, private dialogService: DialogService, private notificationService: NotificationService,) {
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    public ngOnInit(): void {
        // console.log(this.u_id);
        if (this.u_id == 1)
            this.header = 'User List';
        else if (this.u_id == 2)
            this.header = 'Admin List';
        else if (this.u_id == 3)
            this.header = 'Agent List';
        else if (this.u_id == 4)
            this.header = 'Merchant List';
        else if (this.u_id == 5)
            this.header = 'Supervisor List';

        /* const currentState = localStorage.getItem('CurrentUserList');
        if (currentState != null) {
            this.gridState = JSON.parse(currentState);
        } else {
            localStorage.setItem('CurrentUserList', JSON.stringify(this.gridState));
        } */

        this.view = this.userService;

        this.getUserList(this.gridState);
    }

    getUserList(gridstate) {
        this.userService.getUserList(gridstate, this.u_id);
    }

    public changeStatus(status: string, userID: number) {
        if (status == 'off')
            status = 'on'
        else
            status = 'off'
        this.userService.changeStatus(status, userID).subscribe(x => {
            if (x.data > 0) {
                this.getUserList(this.gridState);
                this.showSuccess('Change Status successful.');
            }
            else
                this.showError('Change Status unsuccessful.');
        });
    }

    /* public changeUserType(userID: number) {
        const random = uniqueRandom(100000, 999999);

        this.userService.changeUserType(random()).subscribe(x => {
            if (x.data > 0) {
                this.getUserList(this.gridState);
                this.showSuccess('Change Status successful.');
            }
            else
                this.showError('Change Status unsuccessful.');
        });
    } */

    public onChangeStatus(stateID: any): void {
        const stateIndex = this.gridState.filter.filters.findIndex(s => s['field'] == 'status');
        if (stateID == 'All ...')
            stateID = null;
        if (stateID != null) {
            const searchState = { field: 'status', operator: 'contains', value: stateID };
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
        this.getUserList(this.gridState);
    }

    public onChangeRole(stateID: any): void {
        const stateIndex = this.gridState.filter.filters.findIndex(s => s['field'] == 'role');
        if (stateID == 'All ...')
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
        this.getUserList(this.gridState);
    }

    public onStateChange(state: State): void {
        this.gridState = state;
        localStorage.setItem('CurrentUserList', JSON.stringify(this.gridState));
        this.getUserList(this.gridState);
    }

    public addHandler(): void {
        this.editDataItem = new User();
        this.isNew = true;
    }

    public editHandler(dataItem): void {
        this.editDataItem = dataItem;
        this.isNew = false;
    }

    public cancelHandler(): void {
        this.editDataItem = undefined;
    }

    public saveHandler(user: User): void {
        const successmsg = this.isNew ? 'Add new user successful.' : 'Update user successful';
        const unsuccessmsg = this.isNew ? 'Add new user unsuccessful' : 'Update user unsuccessful';
        if (this.isNew) {
            this.userService.saveUser(user).subscribe((x) => {
                if (x.data) {
                    this.getUserList(this.gridState);
                    this.showSuccess(successmsg);
                }
                else {
                    this.showError(unsuccessmsg);
                }
            })
        } else {
            this.userService.updateUser(user).subscribe((x) => {
                if (x.data) {
                    this.getUserList(this.gridState);
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
        this.userService.remove(dataItem).subscribe((x) => {
            if (x.data > 0) {
                this.getUserList(this.gridState);
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
