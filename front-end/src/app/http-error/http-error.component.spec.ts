import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, InjectionToken } from '@angular/core';

import { HttpErrorComponent } from './http-error.component';
import { MAT_DIALOG_DATA } from '@angular/material';

describe('HttpErrorComponent', () => {
    let component: HttpErrorComponent;
    let fixture: ComponentFixture<HttpErrorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HttpErrorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
              {
                provide: MAT_DIALOG_DATA,
                useValue: {}
              }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HttpErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
