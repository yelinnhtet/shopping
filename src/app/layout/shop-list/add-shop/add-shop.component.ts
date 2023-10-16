import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
// import { UserService } from '../../../core/services/user.service';
import { ShopService } from '../../../core/services/shop.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { User } from '../../../core/models/user.model';
import { Shop } from '../../../core/models/shop.model';
import { SVGIcon, cancelIcon, saveIcon } from '@progress/kendo-svg-icons';
import { environment } from './../../../../environments/environment';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import uniqueRandom from 'unique-random';

@Component({
    selector: 'app-add-shop',
    templateUrl: './add-shop.component.html',
    styleUrls: ['./add-shop.component.scss']
})
export class AddShopComponent implements OnInit {

    public active = false;
    uploadLogoSaveUrl = `${environment.api_url}${'shop/logo'}`;
    uploadCoverSaveUrl = `${environment.api_url}${'shop/coverPhoto'}`;
    uploadNrcSaveUrl = `${environment.api_url}${'shop/shopkeeperNrc'}`;

    oldLogoImageUrl = '';
    oldCoverImageUrl = '';
    oldNrcImageUrl = '';
    countryData: any;
    stateData: any;
    cityData: any;
    isCountry: boolean = true;
    isState: boolean = true;
    isStateLoading: boolean;
    isCityLoading: boolean;
    isCountryLoading: boolean;
    nrcPhotoArray: { name: string, data: string }[] = [];
    coverPhotoArray: { name: string, data: string }[] = [];

    constructor(@Inject(LOCALE_ID) private locale: string, private shopService: ShopService, private http: HttpClient) { }

    public shopForm: FormGroup = new FormGroup({
        'id': new FormControl(''),
        'user_id': new FormControl(''),
        'agent_user_id': new FormControl('1'),
        'country_id': new FormControl('', Validators.required),
        'state_id': new FormControl('', Validators.required),
        'city_id': new FormControl('', Validators.required),
        'name': new FormControl('', Validators.required),
        'logo': new FormControl('', Validators.required),
        'logo_image_name': new FormControl(''),
        'old_logo_image': new FormControl(''),
        'cover_photo': new FormControl([], Validators.required),
        'cover_photo_name': new FormControl([]),
        'old_cover_photo': new FormControl([]),
        'shopkeeper_nrc': new FormControl([], Validators.required),
        'nrc_photo_name': new FormControl([]),
        'old_nrc_photo': new FormControl([]),
        'nrc': new FormControl('', Validators.required),
        'address': new FormControl('', Validators.required),
        'lat': new FormControl(''),
        'long': new FormControl(''),
        'agent_code': new FormControl('', Validators.required),
    })

    @Input() public isNew = false;
    @Input() public set model(shop: Shop) {
        this.shopForm.reset(shop);
        this.active = shop !== undefined;

        if (this.active) {
            this.isCountryLoading = true;
            this.getCountry();

            this.shopForm.controls.user_id.setValue(localStorage.getItem('logInUserID'));
            this.shopForm.controls.agent_user_id.setValue(1);

            this.shopForm.controls.logo_image_name.setValue(this.shopForm.value.logo);
            this.shopForm.controls.old_logo_image.setValue(this.shopForm.value.logo);
            this.shopForm.controls.cover_photo_name.setValue(this.shopForm.value.cover_photo);
            this.shopForm.controls.old_cover_photo.setValue(this.shopForm.value.cover_photo);
            this.shopForm.controls.nrc_photo_name.setValue(this.shopForm.value.shopkeeper_nrc);
            this.shopForm.controls.old_nrc_photo.setValue(this.shopForm.value.shopkeeper_nrc);

            if (!this.isNew) {
                this.shopForm.controls.logo.setValue('');
                this.shopForm.controls.cover_photo.setValue('');
                this.shopForm.controls.shopkeeper_nrc.setValue('');
                this.oldLogoImageUrl = `${environment.file_url}${'shop/logo/' + this.shopForm.value.old_logo_image}`;
                this.oldCoverImageUrl = `${environment.file_url}${'shop/coverPhoto/' + this.shopForm.value.old_cover_photo}`;
                this.oldNrcImageUrl = `${environment.file_url}${'shop/shopkeeperNrc/' + this.shopForm.value.old_nrc_photo}`;
                this.shopForm.get('logo').clearValidators();
                this.shopForm.get('logo').updateValueAndValidity();
                this.shopForm.get('cover_photo').clearValidators();
                this.shopForm.get('cover_photo').updateValueAndValidity();
                this.shopForm.get('shopkeeper_nrc').clearValidators();
                this.shopForm.get('shopkeeper_nrc').updateValueAndValidity();
            }
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Shop> = new EventEmitter();

    ngOnInit(): void {

    }

    onChangeCountry() {
        if (this.shopForm.value.country_id != null) {
            this.isCountry = false;
            this.isStateLoading = true;
            this.getState(this.shopForm.value.country_id);
        }
        else {
            this.isCountry = true;
            this.isState = true;
            this.shopForm.controls.state_id.setValue(null);
            this.shopForm.controls.city_id.setValue(null);
        }
    }

    onChangeState() {
        if (this.shopForm.value.state_id != null) {
            this.isState = false;
            this.isCityLoading = true;
            this.getCity(this.shopForm.value.state_id);
        }
        else {
            this.isState = true;
            this.shopForm.controls.city_id.setValue(null);
        }
    }

    public getCountry() {
        this.shopService.getCountry().subscribe(co => { this.countryData = co, this.isCountryLoading = false })
    }

    public getState(country_id) {
        this.shopService.getStateByCountryID(country_id).subscribe(s => { this.stateData = s.data, this.isCountry = false, this.isStateLoading = false })
    }

    public getCity(state_id) {
        this.shopService.getCityByStateID(state_id).subscribe(c => { this.cityData = c.data, this.isState = false, this.isCityLoading = false })
    }

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.shopForm.value);
        this.active = false;
        this.closeForm();
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        // this.cancel.emit();
    }

    /* file upload */
    logofiledata: any;
    uploadLogoEventHandler(e) {
        this.logofiledata = e.target.files[0];
        this.logoFileUpload();
    }

    /* Upload functioanlity */
    logoFileUpload() {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('files', this.logofiledata);
        this.http.post(this.uploadLogoSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.shopForm.controls.logo_image_name.setValue(x.data.image_name);
            }
        });

    }

    /* file upload */
    coverfiledata: any;
    uploadCoverEventHandler(e) {
        this.coverfiledata = e.target.files;
        // this.coverFileUpload();
        if (this.coverfiledata) {
            for (let i = 0; i < this.coverfiledata.length; i++) {
                this.coverFileUpload(this.coverfiledata[i]);
            }
        }
    }

    /* Upload functioanlity */
    coverFileUpload(file) {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('files', file);
        this.http.post(this.uploadCoverSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.coverPhotoArray.push(x.data.image_name)
            }
        });
        this.shopForm.controls.cover_photo_name.setValue(this.coverPhotoArray);
    }

    /* file upload */
    nrcfiledata: any;
    uploadNrcEventHandler(e) {
        this.nrcfiledata = e.target.files;
        // this.nrcFileUpload();
        if (this.nrcfiledata) {
            for (let i = 0; i < this.nrcfiledata.length; i++) {
                this.nrcFileUpload(this.nrcfiledata[i]);
            }
        }
    }

    /* Upload functioanlity */
    nrcFileUpload(file) {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('files', file);
        this.http.post(this.uploadNrcSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.nrcPhotoArray.push(x.data.image_name)
            }
        });
        this.shopForm.controls.nrc_photo_name.setValue(this.nrcPhotoArray);
    }

}
