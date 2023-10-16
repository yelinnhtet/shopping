import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string, private http: HttpClient) { }

    active = false;
    uploadSaveUrl = `${environment.api_url}${'category/uploadImage'}`;
    oldImageUrl = '';

    categoryForm: FormGroup = new FormGroup({
        'id':new FormControl(''),
        'name': new FormControl('', Validators.required),
        'image': new FormControl('', Validators.required),
        'image_name': new FormControl(''),
        'old_image': new FormControl(''),
        'percentage': new FormControl('', Validators.required)
    })

    @Input() public isNew = false;
    @Input() public set model(category: Category){
        this.categoryForm.reset(category);
        this.categoryForm.controls.image_name.setValue(this.categoryForm.value.image)
        this.categoryForm.controls.old_image.setValue(this.categoryForm.value.image)
        this.active = category !== undefined;
        if (!this.isNew) {
            this.categoryForm.controls.image.setValue('');
            this.oldImageUrl = `${environment.file_url}${'category/' + this.categoryForm.value.old_image}`;
            this.categoryForm.get('image').clearValidators();
            this.categoryForm.get('image').updateValueAndValidity();
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Category> = new EventEmitter();

    ngOnInit(): void {

    }

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.categoryForm.value);
        this.closeForm();
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
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
                this.categoryForm.controls.image_name.setValue(x.data.image_name);
            }
        });

    }
}
