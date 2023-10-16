import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Promotions } from '../../../core/models/promotions';
import { PromotionsService } from '../../../core/services/promotions.service';
import { environment } from '../../../../environments/environment';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-add-promotion',
    templateUrl: './add-promotion.component.html',
    styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string, private promotionService: PromotionsService, private http: HttpClient) { }

    active = false;
    uploadPromotionSaveUrl = `${environment.api_url}${'promotion/uploadImage'}`;
    removeFiles: any[] = [];
    imageData: string | ArrayBuffer;
    myRestrictions: FileRestrictions = {
        allowedExtensions: [".jpg", "jpeg", ".png"],
    };
    oldImageUrl = '';

    public promotionForm: FormGroup = new FormGroup({
        'id': new FormControl(''),
        'title': new FormControl('', Validators.required),
        'image': new FormControl(''),
        'image_name': new FormControl(''),
        'old_image': new FormControl(''),
        'start_date': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'type': new FormControl('', Validators.required),
        'status': new FormControl('', Validators.required),
    })

    @Input() public isNew = false;
    @Input() public set model(promotion: Promotions) {
        // console.log(promotion)
        if (promotion.start_date != null || promotion.end_date != null) {
            promotion.start_date = new Date(promotion.start_date);
            promotion.end_date = new Date(promotion.end_date);
        }
        else {
            this.promotionForm.controls.start_date.setValue(new Date)
            this.promotionForm.controls.end_date.setValue(new Date)
        }
        this.promotionForm.reset(promotion);
        this.promotionForm.controls.image_name.setValue(this.promotionForm.value.image)
        this.promotionForm.controls.old_image.setValue(this.promotionForm.value.image)
        this.active = promotion !== undefined;
        if (!this.isNew) {
            this.promotionForm.controls.image.setValue('');
            if (promotion.type_name == 'Start')
                this.promotionForm.controls.type.setValue(0);
            else
                this.promotionForm.controls.type.setValue(1);
            if (promotion.status_name == 'Second Sale')
                this.promotionForm.controls.status.setValue(1);
            else
                this.promotionForm.controls.status.setValue(2);
            this.oldImageUrl = `${environment.file_url}${'promotion/' + this.promotionForm.value.old_image}`;
            this.promotionForm.get('image').clearValidators();
            this.promotionForm.get('image').updateValueAndValidity();
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Promotions> = new EventEmitter();

    ngOnInit(): void {

    }

    public onSave(e): void {
        e.preventDefault();

        this.promotionForm.value.start_date = formatDate(this.promotionForm.value.start_date, 'yyyy-MM-dd', this.locale);
        this.promotionForm.value.end_date = formatDate(this.promotionForm.value.end_date, 'yyyy-MM-dd', this.locale);

        this.save.emit(this.promotionForm.value);
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
        this.http.post(this.uploadPromotionSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.promotionForm.controls.image_name.setValue(x.data.image_name);
            }
        });

    }

    public removeEventHandler(e) {
        this.removeFiles.push(e.files[0].name);
    }
}
