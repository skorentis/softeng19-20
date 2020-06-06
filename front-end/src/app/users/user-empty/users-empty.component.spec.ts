import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEmptyComponent } from './users-empty.component';

describe('UsersEmptyComponent', () => {
    let component: UsersEmptyComponent;
    let fixture: ComponentFixture<UsersEmptyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsersEmptyComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersEmptyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});