import { TestBed } from '@angular/core/testing';

import { FusionService } from './fusion.service';

describe('FusionService', () => {
  let service: FusionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FusionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
