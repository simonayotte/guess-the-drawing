import { TestBed } from '@angular/core/testing';

import { ThumbsUpService } from './thumbs-up.service';

describe('ThumbsUpService', () => {
  let service: ThumbsUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThumbsUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
