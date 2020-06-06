import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QueryNoResultComponent } from './query-no-result.component';

describe('QueryNoResultComponent', () => {
    let component: QueryNoResultComponent;
    let fixture: ComponentFixture<QueryNoResultComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QueryNoResultComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QueryNoResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
