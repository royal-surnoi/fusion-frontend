import { TestBed } from '@angular/core/testing';

import { SubauthService } from './subauth.service';

describe('SubauthService', () => {
  let service: SubauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
