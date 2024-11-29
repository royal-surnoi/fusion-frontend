import { TestBed } from '@angular/core/testing';

import { CandidateActivitiesService } from './candidate-activities.service';

describe('CandidateActivitiesService', () => {
  let service: CandidateActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
