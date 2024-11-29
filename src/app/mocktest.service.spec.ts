import { TestBed } from '@angular/core/testing';

import { MocktestService } from './mocktest.service';

describe('MocktestService', () => {
  let service: MocktestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MocktestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
