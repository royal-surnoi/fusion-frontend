import { TestBed } from '@angular/core/testing';

import { UsersprofileService } from './usersprofile.service';

describe('UsersprofileService', () => {
  let service: UsersprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
