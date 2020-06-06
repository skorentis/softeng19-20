import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFormComponent } from './popup-form.component';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('PopupFormComponent', () => {
    let component: PopupFormComponent;
    let fixture: ComponentFixture<PopupFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule, HttpClientModule, MatDialogModule],
            declarations: [PopupFormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
              PaymentService,
              {
                provide: MAT_DIALOG_DATA,
                useValue: {}
              },
              {
                provide: MatDialogRef,
                useValue: {}
              }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PopupFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
