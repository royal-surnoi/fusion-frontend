import { TestBed } from '@angular/core/testing';

import { CourselandpageService } from './courselandpage.service';

describe('CourselandpageService', () => {
  let service: CourselandpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourselandpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
