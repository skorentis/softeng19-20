import { TestBed, async, inject } from '@angular/core/testing';

import { HomeGuard } from './home.guard';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [HomeGuard]
    });
  });

  it('should ...', inject([HomeGuard], (guard: HomeGuard) => {
    expect(guard).toBeTruthy();
  }));
});

