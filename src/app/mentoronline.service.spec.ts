import { TestBed } from '@angular/core/testing';

import { MentoronlineService } from './mentoronline.service';

describe('MentoronlineService', () => {
  let service: MentoronlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentoronlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
