import { TestBed } from '@angular/core/testing';

import { Fusion2Service } from './fusion2.service';

describe('Fusion2Service', () => {
  let service: Fusion2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fusion2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
