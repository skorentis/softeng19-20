import { TestBed, inject } from '@angular/core/testing';

import { InsertDataService } from './insert-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('InsertDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [InsertDataService]
    });
  });

  it('should be created', inject([InsertDataService], (service: InsertDataService) => {
    expect(service).toBeTruthy();
  }));
});
