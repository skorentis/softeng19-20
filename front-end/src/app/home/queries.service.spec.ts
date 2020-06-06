import { TestBed, inject } from '@angular/core/testing';

import { QueriesService } from './queries.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('QueriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [QueriesService]
    });
  });

  it('should be created', inject([QueriesService], (service: QueriesService) => {
    expect(service).toBeTruthy();
  }));
});
