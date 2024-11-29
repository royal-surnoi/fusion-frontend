import { TestBed } from '@angular/core/testing';

import { Mentor1Service } from './mentor1.service';

describe('Mentor1Service', () => {
  let service: Mentor1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mentor1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
