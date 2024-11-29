import { TestBed } from '@angular/core/testing';

import { ProfiledetailsService } from './profiledetails.service';

describe('ProfiledetailsService', () => {
  let service: ProfiledetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfiledetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
