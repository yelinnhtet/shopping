import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../../core/models/order.model';
import { SVGIcon, cancelIcon, saveIcon } from '@progress/kendo-svg-icons';
import { environment } from './../../../../environments/environment';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import uniqueRandom from 'unique-random';

@Component({
    selector: 'app-add-order',
    templateUrl: './add-order.component.html',
    styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
    userData: any;
    countryCodeData: any;
    public active = false;
    public userStatus: any = [{ status: 'on' }, { status: 'off' }];
    public minPasswordLength = 6;
    public saveIcon: SVGIcon = saveIcon;
    public cancelIcon: SVGIcon = cancelIcon;

    imageData: string | ArrayBuffer;
    imageChangedEvent: any;
    myRestrictions: FileRestrictions = {
        allowedExtensions: [".jpg", ".png"],
    };

    constructor(@Inject(LOCALE_ID) private locale: string, private orderService: OrderService, private http: HttpClient) { }

    public orderForm: FormGroup = new FormGroup({

        'id': new FormControl(''),
        'order_number': new FormControl(''),
        'user_id': new FormControl(''),
        // 'good_id': new FormControl(''),
        // 'quantity': new FormControl('')
    })

    uploadSaveUrl = "";
    uploadRemoveUrl = "";
    removeFiles: any[] = [];

    @Input() public isNew = false;
    @Input() public set model(order: Order) {
        this.orderForm.reset(order);
        // this.orderForm.controls.phonecode.setValue('95')
        // toggle the Dialog visibility
        this.active = order !== undefined;
        if (this.active) {
            this.getCountryCode();

            // if (this.isNew) {
            //     this.orderForm.get('password').setValidators([Validators.required, Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')]);
            // }
            // else {
            //     this.orderForm.get('password').clearValidators();
            // }
            // this.orderForm.get('password').updateValueAndValidity();
        }
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Order> = new EventEmitter();

    ngOnInit(): void {
        this.getCountryCode();

        this.uploadSaveUrl = `${environment.api_url}${'uploadimage'}`;

        // if (this.isNew) {
        //     this.orderForm.get('password').setValidators([Validators.required, Validators.pattern('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + 6 + ',}$')]);

        // }
        // else {
        //     this.orderForm.get('password').clearValidators();
        // }
        // this.orderForm.get('password').updateValueAndValidity();
    }

    getCountryCode() {
        this.orderService.getCountryCode().subscribe(arg => this.countryCodeData = arg);
    }

    public onSave(e): void {
        const random = uniqueRandom(100000, 999999);
        this.orderForm.controls.agent_code.setValue(random());
        // console.log(random())
        // this.orderForm.controls.photo.setValue(this.filedata.name);

        e.preventDefault();
        this.save.emit(this.orderForm.value);
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
    /* Variabe to store file data */
    filedata: any;
    /* File onchange event */
    uploadEventHandler(e) {
        this.filedata = e.files[0];
        // console.log(this.filedata.name)
        // console.log(this.filedata.name)
        // this.fileUpload();
    }
    /* Upload functioanlity */
    fileUpload() {
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('image', this.filedata);
        /* Image Post Request */
        this.http.post(this.uploadSaveUrl, myFormData, {
            headers: headers
        }).subscribe(data => {
            //Check success message
            // console.log(data)
        });

    }
    /* file upload */

    /* public uploadEventHandler(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            console.log(selectedFile)
            this.uploadSaveUrl = URL.createObjectURL(selectedFile);
            const photo = selectedFile.name;
            console.log(photo)
            this.imageChangedEvent = e;
            const reader = new FileReader();
            const imageControl = this.orderForm.value.photo;
            if (imageControl) {
                reader.readAsDataURL(selectedFile);
                reader.onload = () => {
                    this.imageData = reader.result;
                };
                this.orderForm.controls.photo.setValue(photo);
                // console.log(this.orderForm.value.photo);

            }
        }
    } */

    /* dataURLtoFile(dataurl: any, filename: any) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    } */

    public removeEventHandler(e) {
        this.removeFiles.push(e.files[0].name);
    }

}
