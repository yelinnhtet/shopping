import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { Globalfunction } from '../core/global/globalfunction';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    _disableLoginBtn = false;
    requireName = false;
    authType: String = '';
    title: String = '';
    errors: { errors: {} };
    isSubmitting = false;
    authForm: FormGroup;
    loginData: any = {};
    public globalFunction: Globalfunction;
    loading: boolean;
    loginfail = false;

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private dialogService: DialogService) {
        this.globalFunction = new Globalfunction(dialogService);
    }


    public loginForm: FormGroup = new FormGroup({
        'email': new FormControl('', { validators: Validators.compose([Validators.required, Validators.email]), updateOn: 'blur' }),
        'password': new FormControl('', {
            validators: Validators.compose([
                Validators.required,
                Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')
            ]), updateOn: 'blur'
        }),
    })

    ngOnInit() {
        this.route.url.subscribe(data => {
            this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
            if (this.authType === 'register') {
                this.authForm.addControl('email', new FormControl());
            }
        });
    }

    onLoggedin() {
        // localStorage.setItem('isLoggedin', 'true');

        this.loginfail = false;
        this.isSubmitting = true;
        this.errors = { errors: {} };
        const credentials = this.loginForm.value;
        this.loading = true;
        this.userService
            .attemptAuth(this.authType, credentials)
            .subscribe(
                data => {
                    // console.log(data)
                    if (data.err_message) {
                        this.router.navigate(['/login']);
                        this.errors = data.err_message;
                        this.isSubmitting = false;
                        this.loginfail = true;
                        this.loading = false;
                    }
                    else{
                        // console.log(data)
                        this.loading=false,
                        localStorage.setItem('isLoggedin', 'true');
                        this.router.navigate([''])
                    }
                },
                err => {
                    this.errors = err;
                    this.isSubmitting = false;
                }
            );
    }

    /* forgetPassword() {
        const email = this.loginData.email;
        if (email != null && email != '') {
            this.requireName = false;
            this.unlockService.forgetPassword(email)
                .subscribe(x => {
                    if (x) {
                        this.globalFunction.messageDialogBox('Your password has been sent! Please check your email!', 'Forget Password');
                    } else {
                        this.globalFunction.messageDialogBox('The login name you entered is not there in our database.', 'Forget Password');
                    }
                });
        } else {
            this.requireName = true;
        }
    } */
}
