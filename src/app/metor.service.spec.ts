import { TestBed } from '@angular/core/testing';

import { MetorService } from './metor.service';

describe('MetorService', () => {
  let service: MetorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
