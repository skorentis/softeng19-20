import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MakePaymentComponent } from './make-payment.component';
import { PaymentService } from '../payment.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MatDialogModule } from '@angular/material';

describe('MakePaymentComponent', () => {
    let component: MakePaymentComponent;
    let fixture: ComponentFixture<MakePaymentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule, MatDialogModule],
            declarations: [MakePaymentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [PaymentService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MakePaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
