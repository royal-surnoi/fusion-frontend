import { TestBed } from '@angular/core/testing';

import { AimlservicecourserecService } from './aimlservicecourserec.service';

describe('AimlservicecourserecService', () => {
  let service: AimlservicecourserecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AimlservicecourserecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
