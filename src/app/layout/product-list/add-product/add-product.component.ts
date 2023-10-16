import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { ProductService } from '../../../core/services/product.service';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
    categoryData: any;
    shopData: any;
    isShopLoading: boolean;
    isCategoryLoading: boolean;
    photoArray: { name: string, data: string }[] = [];
    isCurrencyLoading: boolean;
    currencyData: any;

    constructor(@Inject(LOCALE_ID) private locale: string, private fb: FormBuilder, private productService: ProductService, private http: HttpClient) { }

    active = false;
    uploadPhotoSaveUrl = `${environment.api_url}${'product/uploadImage'}`;

    oldImageUrl = '';

    public productForm: FormGroup = new FormGroup({
        'id': new FormControl(''),
        'name': new FormControl('', Validators.required),
        'photo': new FormControl([]),
        'image_name': new FormControl([]),
        'old_image': new FormControl([]),
        'shop_id': new FormControl('', Validators.required),
        'category_id': new FormControl('', Validators.required),
        'currency_id': new FormControl('', Validators.required),
        'price': new FormControl('', Validators.required),
        'discount': new FormControl(''),
        // 'qty': new FormControl('', Validators.required),
        'description': new FormControl(''),
        para_name: this.fb.array([]),
        para_value: this.fb.array([]),
        spec_name: this.fb.array([]),
        spec_value: this.fb.array([]),
    })

    @Input() public isNew = false;
    @Input() public set model(product: Product) {
        this.productForm.reset(product);
        this.productForm.controls.image_name.setValue(this.productForm.value.photo)
        this.productForm.controls.old_image.setValue(this.productForm.value.photo)
        this.active = product !== undefined;

        if (!this.isNew) {
            this.productForm.controls.photo.setValue('');
            this.oldImageUrl = `${environment.file_url}${'good/goodPhoto/' + this.productForm.value.old_image}`;
            this.productForm.get('photo').clearValidators();
            this.productForm.get('photo').updateValueAndValidity();
        }
        if (this.active) {
            this.isShopLoading = true;
            this.isCategoryLoading = true;
            this.isCurrencyLoading = true;
            this.productService.getShop().subscribe((sh: any) => { this.shopData = sh.data, this.isShopLoading = false });
            this.productService.getCategory().subscribe((cate: any) => { this.categoryData = cate.data, this.isCategoryLoading = false });
            this.productService.getCurrency().subscribe((cur: any) => { this.currencyData = cur.data, this.isCurrencyLoading = false });
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Product> = new EventEmitter();

    ngOnInit(): void {

    }

    addPara() {
        const para_name = this.productForm.get('para_name') as FormArray;
        para_name.push(this.fb.control(''));
        const para_value = this.productForm.get('para_value') as FormArray;
        para_value.push(this.fb.control(''));
    }
    addSpec() {
        const spec_name = this.productForm.get('spec_name') as FormArray;
        spec_name.push(this.fb.control(''));
        const spec_value = this.productForm.get('spec_value') as FormArray;
        spec_value.push(this.fb.control(''));
    }

    getFormArrayControls(arrayName: string) {
        return (this.productForm.get(arrayName) as FormArray).controls;
    }

    removePara(arrayName1: string, arrayName2: string, index: number) {
        const formArray1 = this.productForm.get(arrayName1) as FormArray;
        formArray1.removeAt(index);
        const formArray2 = this.productForm.get(arrayName2) as FormArray;
        formArray2.removeAt(index);
    }

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.productForm.value);
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
        this.filedata = e.target.files;
        if (this.filedata) {
            for (let i = 0; i < this.filedata.length; i++) {
                this.fileUpload(this.filedata[i]);
            }
        }
    }

    /* Upload functioanlity */
    fileUpload(file) {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('files', file);
        this.http.post(this.uploadPhotoSaveUrl, myFormData, {
            headers: headers
        }).subscribe((x: any) => {
            if (x.data) {
                this.photoArray.push(x.data.image_name)
                // this.productForm.controls.image_name.setValue(x.data.image_name);
            }
        });
        this.productForm.controls.image_name.setValue(this.photoArray);
    }

}
