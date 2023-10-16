import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Currency } from '../../../core/models/currency.model';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string) { }

    active = false;

    currencyForm: FormGroup = new FormGroup({
        'id':new FormControl(''),
        'currency_name': new FormControl('', Validators.required),
        'currency_symbol': new FormControl('', Validators.required),
        'currency_code': new FormControl('', Validators.required),
        'currency_exchange': new FormControl('', Validators.required)
    })

    @Input() public isNew = false;
    @Input() public set model(currency: Currency){
        this.currencyForm.reset(currency);
        this.active = currency !== undefined;
    }

    @Output() cancel: EventEmitter<undefined> = new EventEmitter();
    @Output() save: EventEmitter<Currency> = new EventEmitter();

    ngOnInit(): void {

    }

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.currencyForm.value);
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
}
