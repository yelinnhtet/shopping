import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

    public signUpForm: FormGroup = new FormGroup({
        'username': new FormControl('', Validators.required),
        'phone': new FormControl('', Validators.required),
        'email': new FormControl('', { validators: Validators.compose([Validators.required, Validators.email]), updateOn: 'blur' }),
        'password': new FormControl('', {
            validators: Validators.compose([
                Validators.required,
                Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')
            ]), updateOn: 'blur'
        }),
    })

    ngOnInit() { }

    onSignUp() {
        this.userService.saveUser(this.signUpForm.value).subscribe((x: any) => {
            if (x.data)
                this.router.navigate(['/login']);
        })
    }
}
