import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { SVGIcon, cancelIcon, saveIcon } from '@progress/kendo-svg-icons';
import { environment } from './../../../../environments/environment';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import uniqueRandom from 'unique-random';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
    userData: any;
    countryCodeData: any;
    public active = false;
    public userStatus: any = [{ status: 'on' }, { status: 'off' }];
    public minPasswordLength = 6;
    oldImageUrl: string;
    uploadSaveUrl = `${environment.api_url}${'user/uploadPhoto'}`;

    public roleData: any = [{ role: 'User' }, { role: 'Admin' }, { role: 'Agent' }, { role: 'Supervisor' }, { role: 'Merchant' }];


    constructor(@Inject(LOCALE_ID) private locale: string, private userService: UserService, private http: HttpClient) { }

    public userForm: FormGroup = new FormGroup({
        'id': new FormControl(''),
        'photo': new FormControl(''),
        'image_name': new FormControl(''),
        'old_image': new FormControl(''),
        'username': new FormControl('', Validators.required),
        'email': new FormControl('', { validators: Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)]), updateOn: 'blur' }),
        'phonecode': new FormControl('', Validators.required),
        'phone': new FormControl('', { validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]) }),
        'password': new FormControl('', {
            validators: Validators.compose([
                Validators.required,
                Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')
            ]), updateOn: 'blur'
        }),
        'role': new FormControl(),
        'agent_code': new FormControl(),
        'lat': new FormControl(''),
        'long': new FormControl(''),
        
    })

    @Input() public isNew = false;
    @Input() public set model(user: User) {
        this.userForm.reset(user);
        this.userForm.controls.phonecode.setValue('95');
        this.userForm.controls.image_name.setValue(this.userForm.value.photo)
        this.userForm.controls.old_image.setValue(this.userForm.value.photo)
        // toggle the Dialog visibility
        this.active = user !== undefined;
        if (this.active) {
            this.getCountryCode();

            if (this.isNew) {

                this.userForm.get('password').setValidators([Validators.required, Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')]);
            }
            else {
                this.userForm.controls.username.setValue(user.name);
                this.userForm.controls.photo.setValue('');
                this.oldImageUrl = `${environment.file_url}${'user/' + this.userForm.value.old_image}`;
                this.userForm.get('photo').clearValidators();
                this.userForm.get('password').clearValidators();
            }
            this.userForm.get('photo').updateValueAndValidity();
            this.userForm.get('password').updateValueAndValidity();
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<User> = new EventEmitter();

    ngOnInit(): void {
        this.getCountryCode();
    }

    getCountryCode() {
        this.userService.getCountryCode().subscribe(arg => this.countryCodeData = arg);
    }

    public onSave(e): void {
        if(this.userForm.value.role != "Admin" && this.userForm.value.role != "Merchant"){
            const random = uniqueRandom(100000, 999999);
            this.userForm.controls.agent_code.setValue(random());
        }

        e.preventDefault();
        this.save.emit(this.userForm.value);
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }

    /* file upload */
    filedata: any;
    uploadEventHandler(e) {
        this.filedata = e.target.files[0];
        this.fileUpload();
    }

    /* Upload functioanlity */
    fileUpload() {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('files', this.filedata);
        this.http.post(this.uploadSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.userForm.controls.image_name.setValue(x.data.image_name);
            }
        });
    }

}
