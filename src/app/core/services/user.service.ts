import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, Observable, ReplaySubject, distinctUntilChanged, map } from "rxjs";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { JwtService } from "./jwt.service";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})

export class UserService extends BehaviorSubject<GridDataResult> {

    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();
    public gridLoading: boolean;
    constructor(private apiService: ApiService, private jwtService: JwtService) {
        super(null);
    }

    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.
    populate() {
        // If JWT detected, attempt to get & store user's info
        if (this.jwtService.getToken()) {
            this.apiService.get('user')
                .subscribe(
                    data => this.setAuth(data.user),
                    err => this.purgeAuth()
                );
        } else {
            // Remove any potential remnants of previous auth states
            this.purgeAuth();
        }
    }

    setAuth(user: any) {
        // Save JWT sent from server in localstorage
        this.jwtService.saveToken(user.token);
        // Set current user data into observable
        this.currentUserSubject.next(user);
        // Set isAuthenticated to true
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {
        // Remove JWT from localstorage
        this.jwtService.destroyToken();
        // Set current user to an empty object
        this.currentUserSubject.next({} as User);
        // Set auth status to false
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(type, credentials): Observable<any> {
        const body = {
            "email": credentials.email,
            "password": credentials.password,
            "grant_type": "password"
        }
        return this.apiService.postAuthJson('login', body)
            .pipe(map(
                data => {
                    localStorage.setItem('authorizationData', data.token); // save access token
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('name', data.name);
                    localStorage.setItem('logInUserID', data.id);

                    localStorage.setItem('isLoggedin', 'true');
                    this.setAuth(data);
                    return <any>data;
                }
            ));
    }

    getUserList(gridState: [], u_id: number) {
        this.gridLoading = true;
        this.apiService.fetchgrid_postJson('user/userList', { "gridState": gridState, "u_id": u_id })
            .subscribe((x) => {
                super.next(x);
                this.gridLoading = false;
            });
    }

    getCountryCode() {
        return this.apiService.get('countryCode');
    }

    changeStatus(status: string, userID: number) {
        return this.apiService.postJson('user/changeStatus', { "status": status, "id": userID })
    }

    changeUserType(userID: number) {
        return this.apiService.postJson('user/changeUserType', { "id": userID })
    }

    saveUser(objInfo: any) {
        return this.apiService.postJson('user/register', objInfo);
    }

    updateUser(objInfo: any) {
        return this.apiService.postJson('user/updateUser', objInfo);
    }

    remove(objInfo: any) {
        return this.apiService.postJson('user/remove', objInfo);
    }

    public data: any = [{ role: 'user' }, { role: 'Admin' }, { role: 'Agent' }, { role: 'Supervisor' }, { role: 'Merchant' }];

    getUserRoleList(gridState: []) {
        this.gridLoading = true;

        if (this.data.length) {
            const objInfo = {
                data: this.data,
                total: parseInt(this.data.length, 10)
            }
            this.gridLoading = false;
            return super.next(objInfo);
        }

    }
}
