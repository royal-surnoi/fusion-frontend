import { TestBed } from '@angular/core/testing';

import { ImagePostService } from './image-post.service';

describe('ImagePostService', () => {
  let service: ImagePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
