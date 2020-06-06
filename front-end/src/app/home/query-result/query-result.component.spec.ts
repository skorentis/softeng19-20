import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResultComponent } from './query-result.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { QueriesService } from '../queries.service';

describe('QueryResultComponent', () => {
    let component: QueryResultComponent;
    let fixture: ComponentFixture<QueryResultComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QueryResultComponent],
            imports: [HttpClientModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QueryResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
