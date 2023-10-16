import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { Ads } from '../../../core/models/ads.model';
import { AdsService } from '../../../core/services/ads.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-add-ads',
    templateUrl: './add-ads.component.html',
    styleUrls: ['./add-ads.component.scss']
})
export class AddAdsComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string, private adsService: AdsService, private http: HttpClient) { }

    active = false;
    uploadSaveUrl = `${environment.api_url}${'ads/uploadImage'}`;
    removeFiles: any[] = [];
    imageData: string | ArrayBuffer;
    myRestrictions: FileRestrictions = {
        allowedExtensions: [".jpg", "jpeg", ".png"],
    };
    oldImageUrl = '';

    public adsForm: FormGroup = new FormGroup({
        'id': new FormControl(''),
        'image_path': new FormControl('', Validators.required),
        'image_name': new FormControl(''),
        'old_image': new FormControl(''),
        'name': new FormControl('', Validators.required)
    })

    @Input() public isNew = false;
    @Input() public set model(ads: Ads) {
        this.adsForm.reset(ads);
        this.adsForm.controls.image_name.setValue(this.adsForm.value.image_path)
        this.adsForm.controls.old_image.setValue(this.adsForm.value.image_path)
        this.active = ads !== undefined;
        if (!this.isNew) {
            this.adsForm.controls.image_path.setValue('');
            this.oldImageUrl = `${environment.file_url}${'ads/' + this.adsForm.value.old_image}`;
            this.adsForm.get('image_path').clearValidators();
            this.adsForm.get('image_path').updateValueAndValidity();
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Ads> = new EventEmitter();

    ngOnInit(): void {

    }

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.adsForm.value);
        this.closeForm();
        this.active = false;
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
                this.adsForm.controls.image_name.setValue(x.data.image_name);
            }
        });

    }

    public removeEventHandler(e) {
        this.removeFiles.push(e.files[0].name);
    }

}
