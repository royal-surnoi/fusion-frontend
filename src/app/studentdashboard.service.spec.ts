import { TestBed } from '@angular/core/testing';

import { StudentdashboardService } from './studentdashboard.service';

describe('StudentdashboardService', () => {
  let service: StudentdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
